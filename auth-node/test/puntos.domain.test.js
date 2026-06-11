import test from 'node:test';
import assert from 'node:assert/strict';
import {
  bonoPorCantidadPedidos,
  nivelPorPuntos,
  progresoNivel,
} from '../src/puntos/puntos.constants.js';

test('maps Aurea levels using the approved thresholds', () => {
  assert.equal(nivelPorPuntos(0).nombre, 'BRONCE');
  assert.equal(nivelPorPuntos(1000).nombre, 'PLATA');
  assert.equal(nivelPorPuntos(3000).nombre, 'ORO');
  assert.equal(nivelPorPuntos(6000).nombre, 'DIAMANTE');
});

test('calculates progress and missing points', () => {
  assert.deepEqual(progresoNivel(750), {
    nivel: 'BRONCE',
    siguienteNivel: 'PLATA',
    puntosSiguienteNivel: 1000,
    puntosFaltantes: 250,
  });
});

test('awards automatic order milestone bonuses only once per threshold', () => {
  assert.equal(bonoPorCantidadPedidos(1), 100);
  assert.equal(bonoPorCantidadPedidos(5), 250);
  assert.equal(bonoPorCantidadPedidos(10), 500);
  assert.equal(bonoPorCantidadPedidos(20), 1000);
  assert.equal(bonoPorCantidadPedidos(6), 0);
});
