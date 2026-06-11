import Mesa from './mesas.model.js';

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
  IdRestaurante: data.restauranteId || 'aurea-main',
});

export const mapMesaDto = (mesa) => ({
  id: mesa._id.toString(),
  numero: mesa.Numero,
  capacidad: mesa.Capacidad,
  estado: mesa.EstadoMesa,
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
  const mesa = await Mesa.findByIdAndDelete(id);
  if (!mesa) {
    throw new MesaError('TABLE_NOT_FOUND', 'Mesa no encontrada', 404);
  }

  return mesa;
};

export const listarMesas = async (filters = {}) => {
  const query = {};

  if (filters.estado) query.EstadoMesa = normalizeEstado(filters.estado);
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
