import nodemailer from 'nodemailer';
import PDFDocument from 'pdfkit';
import Notificacion from './notificacion.model.js';
import { pedidoEmail, recompensaEmail, reservacionEmail } from './email.templates.js';

const smtpEnabled = () => process.env.SMTP_ENABLED === 'true';
const contactEmail = () => process.env.SMTP_FROM_EMAIL || 'loscodiguitos26@gmail.com';

const createTransport = () => nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === 'true' || Number(process.env.SMTP_PORT) === 465,
  auth: process.env.SMTP_USER && process.env.SMTP_PASS
    ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    : undefined,
});

const pdfBuffer = ({ title, lines }) => new Promise((resolve, reject) => {
  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  const chunks = [];
  doc.on('data', (chunk) => chunks.push(chunk));
  doc.on('end', () => resolve(Buffer.concat(chunks)));
  doc.on('error', reject);
  doc.rect(0, 0, doc.page.width, doc.page.height).fill('#080808');
  doc.rect(32, 32, doc.page.width - 64, doc.page.height - 64).lineWidth(1).stroke('#6b5525');
  doc.fillColor('#d4af37').font('Helvetica-Bold').fontSize(30).text('A U R E A', 50, 70, { align: 'center' });
  doc.fillColor('#8e7a45').font('Helvetica').fontSize(9).text('RESTAURANT EXPERIENCE', { align: 'center', characterSpacing: 3 });
  doc.moveDown(2);
  doc.fillColor('#fff4d6').font('Helvetica-Bold').fontSize(20).text(title, { align: 'center' });
  doc.moveDown(1.4);
  const cardTop = doc.y;
  const cardHeight = Math.max(150, lines.length * 28 + 38);
  doc.roundedRect(62, cardTop, doc.page.width - 124, cardHeight, 12).fillAndStroke('#121212', '#332a19');
  let y = cardTop + 24;
  lines.forEach((line, index) => {
    doc.fillColor(index === lines.length - 1 ? '#d4af37' : '#e6dfd0')
      .font(index === lines.length - 1 ? 'Helvetica-Bold' : 'Helvetica')
      .fontSize(index === lines.length - 1 ? 13 : 11)
      .text(line, 84, y, { width: doc.page.width - 168 });
    y += 27;
  });
  doc.fillColor('#756e61').font('Helvetica').fontSize(9)
    .text(`5ta avenida 12-34, Zona 10, Ciudad de Guatemala | ${contactEmail()}`, 60, doc.page.height - 88, {
      width: doc.page.width - 120,
      align: 'center',
    });
  doc.end();
});

const sendNow = async (notification, attachments = []) => {
  if (!smtpEnabled()) {
    console.warn(`SMTP_DISABLED recipient=${notification.destinatario} subject="${notification.asunto}"`);
    return;
  }

  const transporter = createTransport();
  try {
    await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME || 'Aurea Restaurant'}" <${process.env.SMTP_FROM_EMAIL}>`,
      to: notification.destinatario,
      subject: notification.asunto,
      html: notification.html,
      attachments,
    });
    console.info(`EMAIL_SENT recipient=${notification.destinatario} subject="${notification.asunto}"`);
  } catch (error) {
    console.error(
      `EMAIL_FAILED recipient=${notification.destinatario} subject="${notification.asunto}" error="${error.message}"`
    );
    throw error;
  } finally {
    transporter.close();
  }
};

const persistAndSend = async ({ query, insert, attachments }) => {
  const result = await Notificacion.findOneAndUpdate(
    query,
    { $setOnInsert: insert },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  if (result.estado === 'ENVIADA') return result;

  try {
    await sendNow(result, attachments);
    if (smtpEnabled()) {
      result.estado = 'ENVIADA';
      result.ultimoError = '';
      await result.save();
    }
  } catch (error) {
    result.estado = 'ERROR';
    result.intentos += 1;
    result.ultimoError = error.message;
    await result.save();
  }

  return result;
};

export const encolarPedido = async ({ pedido, cliente, estado }) => {
  if (!cliente?.correo) return null;
  const html = pedidoEmail({ cliente: `${cliente.nombre} ${cliente.apellido}`.trim(), pedido, estado });
  const attachments = [await pdfBuffer({
    title: `Ticket pedido #${pedido.id.slice(-8)}`,
    lines: [
      `Cliente: ${cliente.nombre} ${cliente.apellido}`,
      `Estado: ${estado}`,
      `Total: Q${Number(pedido.total).toFixed(2)}`,
      ...pedido.productos.map((item) => `${item.cantidad}x ${item.nombre} - Q${Number(item.totalLinea).toFixed(2)}`),
    ],
  }).then((content) => ({ filename: `pedido-${pedido.id.slice(-8)}.pdf`, content }))];

  return persistAndSend({
    query: { referencia: `pedido:${pedido.id}:${estado}` },
    insert: {
      destinatario: cliente.correo,
      clienteId: cliente._id,
      categoria: 'PEDIDO',
      evento: `PEDIDO_${estado.toUpperCase()}`,
      asunto: `Aurea - Pedido ${estado}`,
      html,
      resumen: `Pedido #${pedido.id.slice(-8)} ${estado}`,
      referencia: `pedido:${pedido.id}:${estado}`,
    },
    attachments,
  });
};

export const encolarReservacion = async ({ reserva, cliente, estado }) => {
  if (!cliente?.correo) return null;
  const html = reservacionEmail({ cliente: `${cliente.nombre} ${cliente.apellido}`.trim(), reserva, estado });
  const attachments = [await pdfBuffer({
    title: `Comprobante reservacion #${reserva.id.slice(-8)}`,
    lines: [
      `Cliente: ${cliente.nombre} ${cliente.apellido}`,
      `Mesa: ${reserva.mesaNumero || 'por asignar'}`,
      `Zona: ${reserva.zona || 'Aurea'}`,
      `Fecha: ${reserva.fecha}`,
      `Horario: ${reserva.horaInicio} - ${reserva.horaFin}`,
      `Personas: ${reserva.personas}`,
      `Estado: ${estado}`,
    ],
  }).then((content) => ({ filename: `reservacion-${reserva.id.slice(-8)}.pdf`, content }))];

  return persistAndSend({
    query: { referencia: `reservacion:${reserva.id}:${estado}` },
    insert: {
      destinatario: cliente.correo,
      clienteId: cliente._id,
      categoria: 'RESERVACION',
      evento: `RESERVACION_${estado}`,
      asunto: `Aurea - Reservacion ${estado}`,
      html,
      resumen: `Reservacion #${reserva.id.slice(-8)} ${estado}`,
      referencia: `reservacion:${reserva.id}:${estado}`,
    },
    attachments,
  });
};

export const encolarRecompensa = async ({ cliente, recompensa, puntos }) => {
  if (!cliente?.correo) return null;
  const reference = `recompensa:${cliente._id}:${recompensa.id}:${Date.now()}`;
  return persistAndSend({
    query: { referencia: reference },
    insert: {
      destinatario: cliente.correo,
      clienteId: cliente._id,
      categoria: 'RECOMPENSA',
      evento: 'RECOMPENSA_CANJEADA',
      asunto: 'Aurea - Recompensa canjeada',
      html: recompensaEmail({ cliente: `${cliente.nombre} ${cliente.apellido}`.trim(), recompensa, puntos }),
      resumen: `Recompensa canjeada: ${recompensa.nombre}`,
      referencia: reference,
    },
  });
};

export const listarNotificacionesCliente = async (clienteId) => (
  Notificacion.find({ clienteId }).sort({ createdAt: -1 }).limit(80)
);

export const registrarEventoAdmin = async ({
  evento,
  asunto,
  resumen,
  categoria = 'CUENTA',
  referencia,
}) => Notificacion.findOneAndUpdate(
  { referencia },
  {
    $setOnInsert: {
      destinatario: 'admin@aurea.local',
      categoria,
      evento,
      asunto,
      resumen,
      html: `<p>${resumen}</p>`,
      referencia,
      estado: 'PENDIENTE',
    },
  },
  { upsert: true, new: true, setDefaultsOnInsert: true }
);

export const listarNotificacionesAdmin = async () => (
  Notificacion.find().sort({ createdAt: -1 }).limit(100)
);

export const marcarNotificacionAdminLeida = async (id) => (
  Notificacion.findByIdAndUpdate(
    id,
    { leidaAdmin: true, fechaLecturaAdmin: new Date() },
    { new: true }
  )
);

export const marcarTodasAdminLeidas = async () => (
  Notificacion.updateMany(
    { leidaAdmin: false },
    { leidaAdmin: true, fechaLecturaAdmin: new Date() }
  )
);
