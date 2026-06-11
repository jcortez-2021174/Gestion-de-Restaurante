import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createOrderPayload,
  isMongoObjectId,
  mapMenuProduct,
} from '../src/features/user/order.contract.js';
import {
  extractProductCollection,
  mapVisibleMenuProducts,
} from '../src/features/user/menu.products.js';

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

test('rejects mock and numeric product ids', () => {
  assert.equal(isMongoObjectId('507f1f77bcf86cd799439011'), true);
  assert.equal(isMongoObjectId('featured-1'), false);
  assert.equal(isMongoObjectId(1), false);
});

test('extracts products from the backend response envelope', () => {
  const products = [{ _id: '507f1f77bcf86cd799439011' }];

  assert.deepEqual(extractProductCollection({ success: true, total: 1, data: products }), products);
  assert.deepEqual(extractProductCollection(products), products);
});

test('keeps available products and supports unpopulated category ids', () => {
  const products = mapVisibleMenuProducts({
    data: [
      {
        _id: '507f1f77bcf86cd799439011',
        nombre: 'Cordero',
        precio: 165,
        disponibilidad: 'Disponible',
        idCategoria: '507f191e810c19729de860ea',
      },
      {
        _id: '507f1f77bcf86cd799439012',
        nombre: 'Agotado',
        precio: 80,
        disponibilidad: 'NoDisponible',
        idCategoria: '507f191e810c19729de860eb',
      },
    ],
  });

  assert.equal(products.length, 1);
  assert.equal(products[0].id, '507f1f77bcf86cd799439011');
  assert.equal(products[0].categoriaId, '507f191e810c19729de860ea');
});
