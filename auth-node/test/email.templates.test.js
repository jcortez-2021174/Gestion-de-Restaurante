import test from 'node:test';
import assert from 'node:assert/strict';
import { pedidoEmail, recompensaEmail, reservacionEmail } from '../src/notificaciones/email.templates.js';

test('renders a premium order email with product pricing and Aurea branding', () => {
  const html = pedidoEmail({
    cliente: 'Ana Lopez',
    estado: 'Listo',
    pedido: {
      id: 'pedido-12345678',
      total: 91,
      productos: [{
        nombre: 'Pasta Aurea',
        cantidad: 2,
        precioUnitario: 45.5,
        totalLinea: 91,
      }],
    },
  });

  assert.match(html, /AUREA/);
  assert.match(html, /Tu pedido esta listo/);
  assert.match(html, /Pasta Aurea/);
  assert.match(html, /Q91\.00/);
});

test('escapes customer data in reservation emails', () => {
  const html = reservacionEmail({
    cliente: '<script>alert(1)</script>',
    estado: 'CONFIRMADA',
    reserva: {
      id: 'reserva-12345678',
      mesaNumero: 4,
      zona: 'VIP',
      fecha: '2026-06-20',
      horaInicio: '19:00',
      horaFin: '20:30',
      personas: 2,
    },
  });

  assert.doesNotMatch(html, /<script>/);
  assert.match(html, /Reservacion confirmada/);
  assert.match(html, /VIP/);
});

test('renders reward redemption details', () => {
  const html = recompensaEmail({
    cliente: 'Luis',
    recompensa: { nombre: 'Postre de cortesia' },
    puntos: 850,
  });

  assert.match(html, /Recompensa canjeada/);
  assert.match(html, /Postre de cortesia/);
  assert.match(html, /850 puntos/);
});
