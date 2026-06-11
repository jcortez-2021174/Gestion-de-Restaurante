import Mesa from './mesas.model.js';
import Reservacion from '../reservacion/reservacion.model.js';

export class MesaError extends Error {
  constructor(code, message, status = 400) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

const normalizeEstado = (estado = 'DISPONIBLE') => estado.toUpperCase();

const toPersistence = (data) => ({
  Numero: data.numero,
  Capacidad: data.capacidad,
  EstadoMesa: normalizeEstado(data.estado),
  Zona: normalizeEstado(data.zona || 'INTERIOR'),
  Forma: normalizeEstado(data.forma || 'RECTANGULO'),
  PosicionX: Number(data.posicion?.x ?? data.posicionX ?? 50),
  PosicionY: Number(data.posicion?.y ?? data.posicionY ?? 50),
  IdRestaurante: data.restauranteId || 'aurea-main',
});

export const mapMesaDto = (mesa) => ({
  id: mesa._id.toString(),
  numero: mesa.Numero,
  capacidad: mesa.Capacidad,
  estado: mesa.EstadoMesa,
  zona: mesa.Zona || 'INTERIOR',
  forma: mesa.Forma || 'RECTANGULO',
  posicion: {
    x: mesa.PosicionX ?? 50,
    y: mesa.PosicionY ?? 50,
  },
  restauranteId: mesa.IdRestaurante,
  fechaCreacion: mesa.createdAt,
});

export const crearMesa = async (data) => {
  const mesa = await Mesa.create(toPersistence(data));
  return mapMesaDto(mesa);
};

export const editarMesa = async (id, data) => {
  const mesa = await Mesa.findByIdAndUpdate(
    id,
    toPersistence(data),
    { new: true, runValidators: true }
  );

  if (!mesa) {
    throw new MesaError('TABLE_NOT_FOUND', 'Mesa no encontrada', 404);
  }

  return mapMesaDto(mesa);
};

export const eliminarMesa = async (id) => {
  const reservaciones = await Reservacion.countDocuments({
    idMesa: id,
    estadoReservacion: { $in: ['PENDIENTE', 'CONFIRMADA'] },
    isActive: true,
  });
  if (reservaciones > 0) {
    throw new MesaError(
      'TABLE_IN_USE',
      'La mesa tiene reservaciones activas y no puede eliminarse',
      409
    );
  }

  const mesa = await Mesa.findByIdAndDelete(id);
  if (!mesa) {
    throw new MesaError('TABLE_NOT_FOUND', 'Mesa no encontrada', 404);
  }

  return mesa;
};

export const listarMesas = async (filters = {}) => {
  const query = {};

  if (filters.incluirReservadas === 'true') {
    query.EstadoMesa = { $nin: ['OCUPADA', 'FUERA_SERVICIO'] };
  }
  else if (filters.estado) query.EstadoMesa = normalizeEstado(filters.estado);
  if (filters.zona) query.Zona = normalizeEstado(filters.zona);
  if (filters.capacidad) query.Capacidad = { $gte: Number(filters.capacidad) };

  const mesas = await Mesa.find(query).sort({ Numero: 1 });
  return mesas.map(mapMesaDto);
};

export const obtenerMesa = async (id) => {
  const mesa = await Mesa.findById(id);
  if (!mesa) {
    throw new MesaError('TABLE_NOT_FOUND', 'Mesa no encontrada', 404);
  }

  return mapMesaDto(mesa);
};
