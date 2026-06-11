const layout = ({ title, intro, content }) => `<!doctype html>
<html><body style="margin:0;background:#080808;color:#f4f4f4;font-family:Arial,sans-serif">
<table width="100%" cellspacing="0" cellpadding="0"><tr><td align="center" style="padding:32px 16px">
<table width="600" style="max-width:100%;background:#111;border:1px solid #3d3420;border-radius:18px">
<tr><td style="padding:28px;text-align:center;border-bottom:1px solid #3d3420">
<div style="color:#d4af37;font-size:30px;letter-spacing:6px;font-weight:bold">AUREA</div>
<div style="color:#888;font-size:12px">RESTAURANT MANAGER</div></td></tr>
<tr><td style="padding:30px"><h1 style="color:#d4af37;font-size:24px">${title}</h1>
<p style="line-height:1.7;color:#ccc">${intro}</p>${content}</td></tr>
<tr><td style="padding:20px;text-align:center;color:#777;font-size:12px">El Arte del Cordero · Ciudad de Guatemala</td></tr>
</table></td></tr></table></body></html>`;

export const pedidoEmail = ({ cliente, pedido, estado }) => layout({
  title: `Pedido ${estado}`,
  intro: `Hola ${cliente}, tu pedido #${pedido.id.slice(-8)} fue actualizado.`,
  content: `<p style="padding:16px;background:#191919;border-radius:12px">Estado actual: <strong style="color:#d4af37">${estado}</strong><br>Total: Q${Number(pedido.total).toFixed(2)}</p>`,
});

export const reservacionEmail = ({ cliente, reserva, estado }) => layout({
  title: `Reservación ${estado}`,
  intro: `Hola ${cliente}, tu reservación #${reserva.id.slice(-8)} fue actualizada.`,
  content: `<p style="padding:16px;background:#191919;border-radius:12px">Mesa: ${reserva.mesaNumero || 'por asignar'}<br>Fecha: ${reserva.fecha}<br>Horario: ${reserva.horaInicio} - ${reserva.horaFin}<br>Estado: <strong style="color:#d4af37">${estado}</strong></p>`,
});

export const bienvenidaEmail = ({ nombre }) => layout({
  title: 'Bienvenido a Aurea',
  intro: `Hola ${nombre}, tu experiencia Aurea está lista.`,
  content: '<p style="color:#ccc">Reserva, ordena y acumula Puntos Aurea desde tu cuenta.</p>',
});
