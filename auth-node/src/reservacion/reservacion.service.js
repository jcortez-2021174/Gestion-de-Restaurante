import Reservacion from './reservacion.model.js';
import Cliente from '../cliente/cliente.model.js';
import Mesas from '../mesas/mesas.model.js';

class ReservacionError extends Error {
  constructor(code, message, status = 400) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

const toDateOnly = (value) => {
  const date = new Date(value);
  date.setUTCHours(0, 0, 0, 0);
  return date;
};

const mapEstado = (estado = 'RESERVADA') => estado.toUpperCase();

const toPersistence = (data) => ({
  idCliente: data.clienteId,
  idMesa: data.mesaId,
  fechaReservacion: toDateOnly(data.fecha),
  horaInicio: data.horaInicio,
  horaFin: data.horaFin,
  cantidadPersonas: data.personas,
  estadoReservacion: mapEstado(data.estado),
  isActive: true,
});

const populateReservacion = (query) => query
  .populate('idCliente', 'nombre apellido correo telefono')
  .populate('idMesa', 'Numero Capacidad EstadoMesa');

const formatDate = (date) => new Date(date).toISOString().slice(0, 10);

export const mapReservacionDto = (reservacion) => {
  const cliente = reservacion.idCliente;
  const mesa = reservacion.idMesa;

  return {
    id: reservacion._id.toString(),
    clienteId: (cliente?._id || cliente).toString(),
    clienteNombre: cliente?.nombre
      ? `${cliente.nombre} ${cliente.apellido || ''}`.trim()
      : 'Cliente',
    mesaId: (mesa?._id || mesa).toString(),
    mesaNumero: mesa?.Numero ?? null,
    fecha: formatDate(reservacion.fechaReservacion),
    horaInicio: reservacion.horaInicio,
    horaFin: reservacion.horaFin,
    personas: reservacion.cantidadPersonas,
    estado: reservacion.estadoReservacion,
    fechaCreacion: reservacion.createdAt,
  };
};

const assertReferencesExist = async ({ clienteId, mesaId }) => {
  const [clienteExists, mesaExists] = await Promise.all([
    Cliente.exists({ _id: clienteId, isActive: true }),
    Mesas.exists({ _id: mesaId }),
  ]);

  if (!clienteExists) {
    throw new ReservacionError('CLIENT_NOT_FOUND', 'Cliente no encontrado', 404);
  }

  if (!mesaExists) {
    throw new ReservacionError('TABLE_NOT_FOUND', 'Mesa no encontrada', 404);
  }
};

export const crearReservacion = async (data) => {
  await assertReferencesExist(data);
  const reservacion = await Reservacion.create(toPersistence(data));
  const populated = await populateReservacion(Reservacion.findById(reservacion._id));
  return mapReservacionDto(populated);
};

export const listarReservaciones = async (filters = {}) => {
  const query = { isActive: true };

  if (filters.estado) query.estadoReservacion = mapEstado(filters.estado);
  if (filters.fecha) query.fechaReservacion = toDateOnly(filters.fecha);

  const reservaciones = await populateReservacion(
    Reservacion.find(query).sort({ fechaReservacion: 1, horaInicio: 1 })
  );

  return reservaciones.map(mapReservacionDto);
};

export const obtenerReservacionPorId = async (id) => {
  const reservacion = await populateReservacion(Reservacion.findById(id));
  if (!reservacion) {
    throw new ReservacionError('RESERVATION_NOT_FOUND', 'Reservacion no encontrada', 404);
  }

  return mapReservacionDto(reservacion);
};

export const listarReservacionesPorCliente = async (clienteId) => {
  const reservaciones = await populateReservacion(
    Reservacion.find({ idCliente: clienteId, isActive: true })
      .sort({ fechaReservacion: 1, horaInicio: 1 })
  );

  return reservaciones.map(mapReservacionDto);
};

export const listarReservacionesPorMesa = async (mesaId, fecha = null) => {
  const query = { idMesa: mesaId, isActive: true };
  if (fecha) query.fechaReservacion = toDateOnly(fecha);

  const reservaciones = await populateReservacion(
    Reservacion.find(query).sort({ fechaReservacion: 1, horaInicio: 1 })
  );

  return reservaciones.map(mapReservacionDto);
};

export const actualizarReservacion = async (id, data) => {
  await assertReferencesExist(data);
  const reservacion = await Reservacion.findByIdAndUpdate(
    id,
    toPersistence(data),
    { new: true, runValidators: true }
  );

  if (!reservacion) {
    throw new ReservacionError('RESERVATION_NOT_FOUND', 'Reservacion no encontrada', 404);
  }

  const populated = await populateReservacion(Reservacion.findById(reservacion._id));
  return mapReservacionDto(populated);
};

const validStateTransitions = {
  RESERVADA: ['CANCELADA', 'EXPIRADA'],
  CANCELADA: [],
  EXPIRADA: [],
};

export const cambiarEstadoReservacion = async (id, nuevoEstado) => {
  const reservacion = await Reservacion.findById(id);
  if (!reservacion) {
    throw new ReservacionError('RESERVATION_NOT_FOUND', 'Reservacion no encontrada', 404);
  }

  const estado = mapEstado(nuevoEstado);
  const transicionesValidas = validStateTransitions[reservacion.estadoReservacion] || [];
  if (!transicionesValidas.includes(estado)) {
    throw new ReservacionError(
      'INVALID_RESERVATION_STATUS_TRANSITION',
      `No se puede cambiar de ${reservacion.estadoReservacion} a ${estado}`,
      409
    );
  }

  reservacion.estadoReservacion = estado;
  await reservacion.save();

  const populated = await populateReservacion(Reservacion.findById(reservacion._id));
  return mapReservacionDto(populated);
};

export const eliminarReservacion = async (id) => {
  const reservacion = await Reservacion.findByIdAndDelete(id);
  if (!reservacion) {
    throw new ReservacionError('RESERVATION_NOT_FOUND', 'Reservacion no encontrada', 404);
  }

  return reservacion;
};

export const cancelarReservacion = async (id, razon = '') => {
  const reservacion = await Reservacion.findById(id);
  if (!reservacion) {
    throw new ReservacionError('RESERVATION_NOT_FOUND', 'Reservacion no encontrada', 404);
  }

  if (reservacion.estadoReservacion !== 'RESERVADA') {
    throw new ReservacionError(
      'INVALID_RESERVATION_STATUS_TRANSITION',
      `No se puede cancelar una reservacion en estado ${reservacion.estadoReservacion}`,
      409
    );
  }

  reservacion.estadoReservacion = 'CANCELADA';
  reservacion.razonCancelacion = razon || '';
  await reservacion.save();

  const populated = await populateReservacion(Reservacion.findById(reservacion._id));
  return mapReservacionDto(populated);
};
