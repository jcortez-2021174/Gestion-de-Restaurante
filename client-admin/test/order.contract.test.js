import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createOrderPayload,
  mapMenuProduct,
} from '../src/features/user/order.contract.js';

test('checkout sends only mesaId, productoId, and cantidad', () => {
  const payload = createOrderPayload([
    {
      id: '507f1f77bcf86cd799439011',
      nombre: 'Pasta',
      precio: 95,
      cantidad: 2,
      clienteId: 'must-not-be-sent',
      estado: 'must-not-be-sent',
    },
  ]);

  assert.deepEqual(payload, {
    mesaId: null,
    productos: [{
      productoId: '507f1f77bcf86cd799439011',
      cantidad: 2,
    }],
  });
});

test('maps Mongo products to cart-compatible menu products', () => {
  const product = mapMenuProduct({
    _id: '507f1f77bcf86cd799439011',
    nombre: 'Pasta',
    precio: 95,
    disponibilidad: 'Disponible',
    idCategoria: {
      _id: '507f191e810c19729de860ea',
      nombre: 'Almuerzos',
      descripcion: 'Platos fuertes',
    },
  });

  assert.equal(product.id, '507f1f77bcf86cd799439011');
  assert.equal(product.precio, 95);
  assert.equal(product.categoriaNombre, 'Almuerzos');
});
