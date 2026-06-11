const escapeHtml = (value) => String(value ?? '')
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

const money = (value) => `Q${Number(value || 0).toFixed(2)}`;
const frontendUrl = () => (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, '');
const contactEmail = () => process.env.SMTP_FROM_EMAIL || 'loscodiguitos26@gmail.com';

const statusCopy = {
  Pendiente: {
    title: 'Pedido recibido',
    intro: 'Recibimos tu pedido y nuestro equipo ya esta revisando cada detalle.',
    icon: '&#128203;',
  },
  EnPreparacion: {
    title: 'Tu pedido fue aceptado',
    intro: 'La cocina Aurea comenzo a preparar tu experiencia.',
    icon: '&#127859;',
  },
  Listo: {
    title: 'Tu pedido esta listo',
    intro: 'Todo esta preparado. Tu pedido espera el siguiente paso.',
    icon: '&#10024;',
  },
  Entregado: {
    title: 'Pedido entregado',
    intro: 'Gracias por elegir Aurea. Esperamos que disfrutes cada detalle.',
    icon: '&#10003;',
  },
  Cancelado: {
    title: 'Pedido cancelado',
    intro: 'El pedido fue cancelado. Conservamos el registro en tu historial.',
    icon: '&#10005;',
  },
};

const reservationCopy = {
  PENDIENTE: {
    title: 'Solicitud de reservacion recibida',
    intro: 'Recibimos tu solicitud y estamos preparando tu mesa.',
    icon: '&#128197;',
  },
  CONFIRMADA: {
    title: 'Reservacion confirmada',
    intro: 'Tu mesa esta confirmada. Sera un gusto recibirte en Aurea.',
    icon: '&#10003;',
  },
  CANCELADA: {
    title: 'Reservacion cancelada',
    intro: 'La reservacion fue cancelada y quedara disponible en tu historial.',
    icon: '&#10005;',
  },
  COMPLETADA: {
    title: 'Gracias por visitarnos',
    intro: 'Tu reservacion fue completada. Esperamos volver a recibirte pronto.',
    icon: '&#9733;',
  },
};

export const layout = ({
  eyebrow,
  title,
  intro,
  content,
  buttonText,
  buttonUrl,
  icon = '&#9733;',
  note = 'Este correo fue generado automaticamente por Aurea Restaurant.',
}) => `<!doctype html>
<html lang="es">
<body style="margin:0;padding:0;background:#050505;color:#f7f1e4;font-family:Arial,Helvetica,sans-serif">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;background:#050505">
<tr><td align="center" style="padding:30px 12px">
<table role="presentation" width="640" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:640px;border:1px solid #3b3120;background:#0b0b0b">
<tr><td align="center" style="padding:30px 24px 24px;background:#080808;border-bottom:1px solid #2d2619">
<div style="font-family:Georgia,'Times New Roman',serif;font-size:38px;font-weight:700;letter-spacing:9px;color:#d4af37">AUREA</div>
<div style="margin-top:7px;font-size:10px;letter-spacing:4px;color:#8e7a45">RESTAURANT EXPERIENCE</div>
</td></tr>
<tr><td style="padding:36px 38px 20px;background:#100d08">
<div style="display:inline-block;padding:7px 11px;border:1px solid #4d3d1d;color:#e4c96c;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase">${escapeHtml(eyebrow)}</div>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"><tr>
<td style="padding-top:18px">
<h1 style="margin:0 0 14px;font-family:Georgia,'Times New Roman',serif;font-size:34px;line-height:1.12;color:#fff8e7">${escapeHtml(title)}</h1>
<p style="margin:0;color:#cec6b5;font-size:15px;line-height:1.75">${escapeHtml(intro)}</p>
</td>
<td width="64" align="right" style="padding-top:18px;color:#d4af37;font-size:34px">${icon}</td>
</tr></table>
</td></tr>
<tr><td style="padding:18px 38px 38px">
${content}
${buttonUrl ? `<table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin-top:26px"><tr><td bgcolor="#d4af37"><a href="${escapeHtml(buttonUrl)}" style="display:inline-block;padding:15px 26px;color:#090909;font-size:13px;font-weight:800;letter-spacing:1px;text-decoration:none;text-transform:uppercase">${escapeHtml(buttonText || 'Abrir Aurea')}</a></td></tr></table>` : ''}
<p style="margin:24px 0 0;padding:15px 17px;border-left:3px solid #d4af37;background:#100e09;color:#9f9786;font-size:12px;line-height:1.65">${escapeHtml(note)}</p>
</td></tr>
<tr><td style="padding:24px 38px;border-top:1px solid #211d15;background:#080808;color:#756e61;font-size:11px;line-height:1.8">
<strong style="color:#b99b48">Aurea Restaurant</strong><br>
5ta avenida 12-34, Zona 10, Ciudad de Guatemala<br>
+502 1234 5678 &nbsp;|&nbsp; ${escapeHtml(contactEmail())}<br>
<span style="color:#9c8545">Facebook &nbsp; Instagram &nbsp; WhatsApp</span>
</td></tr>
</table></td></tr></table></body></html>`;

const productRows = (items = []) => items.map((item) => `
  <tr>
    <td style="padding:12px 10px;border-bottom:1px solid #2a2418;color:#f4f1e8">${escapeHtml(item.nombre)}</td>
    <td style="padding:12px 10px;border-bottom:1px solid #2a2418;color:#cfc7b7;text-align:center">${Number(item.cantidad || 0)}</td>
    <td style="padding:12px 10px;border-bottom:1px solid #2a2418;color:#cfc7b7;text-align:right">${money(item.precioUnitario)}</td>
    <td style="padding:12px 10px;border-bottom:1px solid #2a2418;color:#d4af37;text-align:right">${money(item.totalLinea)}</td>
  </tr>
`).join('');

export const pedidoEmail = ({ cliente, pedido, estado }) => {
  const copy = statusCopy[estado] || statusCopy.Pendiente;
  return layout({
    eyebrow: `Pedido #${String(pedido.id).slice(-8)}`,
    title: copy.title,
    intro: `Hola ${cliente}. ${copy.intro}`,
    icon: copy.icon,
    buttonText: 'Ver mis pedidos',
    buttonUrl: `${frontendUrl()}/user/orders`,
    note: 'El ticket PDF adjunto contiene el comprobante de este pedido.',
    content: `
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse:collapse;background:#121212;border:1px solid #292318">
        <thead><tr>
          <th style="padding:12px 10px;color:#d4af37;text-align:left;font-size:11px">PRODUCTO</th>
          <th style="padding:12px 10px;color:#d4af37;text-align:center;font-size:11px">CANT.</th>
          <th style="padding:12px 10px;color:#d4af37;text-align:right;font-size:11px">UNITARIO</th>
          <th style="padding:12px 10px;color:#d4af37;text-align:right;font-size:11px">SUBTOTAL</th>
        </tr></thead>
        <tbody>${productRows(pedido.productos)}</tbody>
      </table>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top:16px;background:#171208;border:1px solid #493a1b">
        <tr><td style="padding:16px;color:#bdb39f">Estado</td><td align="right" style="padding:16px;color:#f1d77a;font-weight:bold">${escapeHtml(estado)}</td></tr>
        <tr><td style="padding:0 16px 16px;color:#bdb39f">Total</td><td align="right" style="padding:0 16px 16px;color:#d4af37;font-size:24px;font-weight:bold">${money(pedido.total)}</td></tr>
      </table>
    `,
  });
};

export const reservacionEmail = ({ cliente, reserva, estado }) => {
  const copy = reservationCopy[estado] || reservationCopy.PENDIENTE;
  const detail = (label, value) => `<tr><td style="padding:11px 14px;color:#8d836d;border-bottom:1px solid #242019">${label}</td><td style="padding:11px 14px;color:#fff;text-align:right;border-bottom:1px solid #242019">${escapeHtml(value)}</td></tr>`;
  return layout({
    eyebrow: `Reservacion #${String(reserva.id).slice(-8)}`,
    title: copy.title,
    intro: `Hola ${cliente}. ${copy.intro}`,
    icon: copy.icon,
    buttonText: 'Ver mis reservaciones',
    buttonUrl: `${frontendUrl()}/user/reservations`,
    note: 'Encontraras el comprobante PDF de tu reservacion adjunto a este correo.',
    content: `
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#121212;border:1px solid #292318">
        ${detail('Cliente', cliente)}
        ${detail('Mesa', reserva.mesaNumero ? `Mesa ${reserva.mesaNumero}` : 'Por asignar')}
        ${detail('Zona', reserva.zona || 'Aurea')}
        ${detail('Fecha', reserva.fecha)}
        ${detail('Horario', `${reserva.horaInicio} - ${reserva.horaFin}`)}
        ${detail('Personas', reserva.personas)}
        ${detail('Estado', estado)}
      </table>
    `,
  });
};

export const recompensaEmail = ({ cliente, recompensa, puntos }) => layout({
  eyebrow: 'Puntos Aurea',
  title: 'Recompensa canjeada',
  intro: `Hola ${cliente}, tu recompensa fue canjeada correctamente y ya forma parte de tu historial.`,
  icon: '&#127873;',
  buttonText: 'Ver Puntos Aurea',
  buttonUrl: `${frontendUrl()}/user/puntos`,
  note: 'Presenta tu recompensa segun las condiciones vigentes del programa Aurea.',
  content: `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#121212;border:1px solid #292318">
      <tr><td style="padding:20px;color:#f7f1e4;font-size:18px">${escapeHtml(recompensa.nombre)}</td></tr>
      <tr><td style="padding:0 20px 20px;color:#d4af37;font-weight:bold">Saldo actual: ${Number(puntos || 0).toLocaleString('es-GT')} puntos</td></tr>
    </table>
  `,
});
