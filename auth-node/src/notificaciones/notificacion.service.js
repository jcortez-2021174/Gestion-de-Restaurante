import Notificacion from './notificacion.model.js';
import { pedidoEmail, reservacionEmail } from './email.templates.js';

export const encolarPedido = async ({ pedido, cliente, estado }) => {
  if (!cliente?.correo) return;
  await Notificacion.updateOne(
    { referencia: `pedido:${pedido.id}:${estado}` },
    { $setOnInsert: {
      destinatario: cliente.correo,
      evento: `PEDIDO_${estado.toUpperCase()}`,
      asunto: `Aurea · Pedido ${estado}`,
      html: pedidoEmail({ cliente: `${cliente.nombre} ${cliente.apellido}`.trim(), pedido, estado }),
      referencia: `pedido:${pedido.id}:${estado}`,
    } },
    { upsert: true }
  );
};

export const encolarReservacion = async ({ reserva, cliente, estado }) => {
  if (!cliente?.correo) return;
  await Notificacion.updateOne(
    { referencia: `reservacion:${reserva.id}:${estado}` },
    { $setOnInsert: {
      destinatario: cliente.correo,
      evento: `RESERVACION_${estado}`,
      asunto: `Aurea · Reservación ${estado}`,
      html: reservacionEmail({ cliente: `${cliente.nombre} ${cliente.apellido}`.trim(), reserva, estado }),
      referencia: `reservacion:${reserva.id}:${estado}`,
    } },
    { upsert: true }
  );
};
