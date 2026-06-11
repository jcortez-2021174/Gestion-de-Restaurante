import { randomUUID } from 'node:crypto';
import Cliente from '../cliente/cliente.model.js';
import Pedido from '../pedido/pedido.model.js';
import MovimientoPuntos from './movimiento-puntos.model.js';
import Recompensa from './recompensa.model.js';
import {
  NIVELES_AUREA,
  bonoPorCantidadPedidos,
  progresoNivel,
} from './puntos.constants.js';
import { encolarRecompensa } from '../notificaciones/notificacion.service.js';

export class PuntosError extends Error {
  constructor(code, message, status = 400) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

const mapMovimiento = (movimiento) => ({
  id: movimiento._id.toString(),
  puntos: movimiento.puntos,
  tipo: movimiento.tipo,
  motivo: movimiento.motivo,
  referencia: movimiento.referencia,
  saldoResultante: movimiento.saldoResultante,
  fecha: movimiento.createdAt,
});

export const mapRecompensa = (recompensa) => ({
  id: recompensa._id.toString(),
  nombre: recompensa.nombre,
  descripcion: recompensa.descripcion,
  imagen: recompensa.imagen,
  puntosRequeridos: recompensa.puntosRequeridos,
  activa: recompensa.activa,
  fechaCreacion: recompensa.createdAt,
});

const acreditarMovimiento = async ({
  clienteId,
  puntos,
  tipo,
  motivo,
  referencia,
  pedidoId = null,
}) => {
  const cliente = await Cliente.findOneAndUpdate(
    { _id: clienteId, puntosReferencias: { $ne: referencia } },
    {
      $inc: { puntosAurea: puntos },
      $addToSet: { puntosReferencias: referencia },
    },
    { new: true }
  ).select('+puntosReferencias');

  if (!cliente) {
    return Cliente.findById(clienteId);
  }

  await MovimientoPuntos.updateOne(
    { referencia },
    {
      $setOnInsert: {
        clienteId,
        puntos,
        tipo,
        motivo,
        referencia,
        pedidoId,
        saldoResultante: cliente.puntosAurea,
      },
    },
    { upsert: true }
  );

  return cliente;
};

export const acreditarPedidoEntregado = async (pedido) => {
  const puntosCompra = Math.floor(Number(pedido.Total || 0));
  await acreditarMovimiento({
    clienteId: pedido.IdCliente,
    puntos: puntosCompra,
    tipo: 'PEDIDO',
    motivo: `Pedido #${pedido._id.toString().slice(-8)} entregado`,
    referencia: `pedido:${pedido._id}:consumo`,
    pedidoId: pedido._id,
  });

  const entregados = await Pedido.countDocuments({
    IdCliente: pedido.IdCliente,
    EstadoPedido: 'Entregado',
  });
  const bono = bonoPorCantidadPedidos(entregados);

  if (bono) {
    await acreditarMovimiento({
      clienteId: pedido.IdCliente,
      puntos: bono,
      tipo: 'BONO',
      motivo: `Bono por ${entregados} pedido${entregados === 1 ? '' : 's'} entregado${entregados === 1 ? '' : 's'}`,
      referencia: `bono-pedidos:${pedido.IdCliente}:${entregados}`,
      pedidoId: pedido._id,
    });
  }
};

export const obtenerResumenCliente = async (clienteId) => {
  const [cliente, movimientos, recompensas] = await Promise.all([
    Cliente.findById(clienteId),
    MovimientoPuntos.find({ clienteId }).sort({ createdAt: -1 }).limit(50),
    Recompensa.find({ activa: true }).sort({ puntosRequeridos: 1 }),
  ]);
  if (!cliente) throw new PuntosError('CLIENT_NOT_FOUND', 'Cliente no encontrado', 404);

  return {
    puntos: cliente.puntosAurea || 0,
    ...progresoNivel(cliente.puntosAurea || 0),
    niveles: NIVELES_AUREA,
    movimientos: movimientos.map(mapMovimiento),
    recompensas: recompensas.map(mapRecompensa),
  };
};

export const listarRecompensas = async ({ soloActivas = false } = {}) => (
  (await Recompensa.find(soloActivas ? { activa: true } : {}).sort({ puntosRequeridos: 1 }))
    .map(mapRecompensa)
);

export const crearRecompensa = async (data) => mapRecompensa(await Recompensa.create(data));

export const editarRecompensa = async (id, data) => {
  const recompensa = await Recompensa.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!recompensa) throw new PuntosError('REWARD_NOT_FOUND', 'Recompensa no encontrada', 404);
  return mapRecompensa(recompensa);
};

export const eliminarRecompensa = async (id) => {
  const recompensa = await Recompensa.findByIdAndDelete(id);
  if (!recompensa) throw new PuntosError('REWARD_NOT_FOUND', 'Recompensa no encontrada', 404);
};

export const canjearRecompensa = async (clienteId, recompensaId) => {
  const recompensa = await Recompensa.findOne({ _id: recompensaId, activa: true });
  if (!recompensa) {
    throw new PuntosError('REWARD_NOT_AVAILABLE', 'La recompensa no esta disponible', 404);
  }

  const cliente = await Cliente.findOneAndUpdate(
    { _id: clienteId, puntosAurea: { $gte: recompensa.puntosRequeridos } },
    { $inc: { puntosAurea: -recompensa.puntosRequeridos } },
    { new: true }
  );
  if (!cliente) {
    throw new PuntosError('INSUFFICIENT_POINTS', 'No tienes puntos suficientes', 409);
  }

  const referencia = `canje:${clienteId}:${recompensaId}:${randomUUID()}`;
  const movimiento = await MovimientoPuntos.create({
    clienteId,
    puntos: -recompensa.puntosRequeridos,
    tipo: 'CANJE',
    motivo: `Canje: ${recompensa.nombre}`,
    referencia,
    recompensaId,
    saldoResultante: cliente.puntosAurea,
  });

  await encolarRecompensa({
    cliente,
    recompensa: mapRecompensa(recompensa),
    puntos: cliente.puntosAurea,
  });

  return {
    recompensa: mapRecompensa(recompensa),
    movimiento: mapMovimiento(movimiento),
    puntos: cliente.puntosAurea,
    ...progresoNivel(cliente.puntosAurea),
  };
};
