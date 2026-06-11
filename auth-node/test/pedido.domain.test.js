import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildPriceSnapshots,
  calculateOrderTotals,
  consolidateRequestedProducts,
  mapPedidoDto,
  PedidoError,
} from '../src/pedido/pedido.service.js';

test('consolidates duplicate product quantities', () => {
  assert.deepEqual(
    consolidateRequestedProducts([
      { productoId: 'product-1', cantidad: 2 },
      { productoId: 'product-1', cantidad: 3 },
      { productoId: 'product-2', cantidad: 1 },
    ]),
    [
      { productoId: 'product-1', cantidad: 5 },
      { productoId: 'product-2', cantidad: 1 },
    ]
  );
});

test('creates server price snapshots and calculates totals', () => {
  const snapshots = buildPriceSnapshots(
    [
      { productoId: 'product-1', cantidad: 2 },
      { productoId: 'product-2', cantidad: 1 },
    ],
    [
      { _id: { toString: () => 'product-1' }, nombre: 'Pasta', precio: 45.5 },
      { _id: { toString: () => 'product-2' }, nombre: 'Cafe', precio: 12.25 },
    ]
  );

  assert.equal(snapshots[0].PrecioUnitario, 45.5);
  assert.equal(snapshots[0].NombreProducto, 'Pasta');
  assert.deepEqual(calculateOrderTotals(snapshots), {
    subtotal: 103.25,
    total: 103.25,
  });
});

test('rejects missing or unavailable products', () => {
  assert.throws(
    () => buildPriceSnapshots(
      [{ productoId: 'missing', cantidad: 1 }],
      []
    ),
    (error) => error instanceof PedidoError &&
      error.code === 'PRODUCT_NOT_AVAILABLE' &&
      error.status === 409
  );
});

test('maps an order to the canonical DTO', () => {
  const dto = mapPedidoDto({
    _id: { toString: () => 'order-1' },
    IdCliente: {
      _id: { toString: () => 'client-1' },
      nombre: 'Ana',
      apellido: 'Lopez',
    },
    IdMesa: null,
    Productos: [{
      IdProducto: { toString: () => 'product-1' },
      NombreProducto: 'Pasta',
      Cantidad: 2,
      PrecioUnitario: 45.5,
    }],
    Subtotal: 91,
    Total: 91,
    EstadoPedido: 'Pendiente',
    createdAt: new Date('2026-06-11T12:00:00.000Z'),
  });

  assert.deepEqual(dto, {
    id: 'order-1',
    clienteId: 'client-1',
    clienteNombre: 'Ana Lopez',
    mesaId: null,
    productos: [{
      productoId: 'product-1',
      nombre: 'Pasta',
      cantidad: 2,
      precioUnitario: 45.5,
      totalLinea: 91,
    }],
    subtotal: 91,
    total: 91,
    estado: 'Pendiente',
    fechaCreacion: new Date('2026-06-11T12:00:00.000Z'),
  });
});
