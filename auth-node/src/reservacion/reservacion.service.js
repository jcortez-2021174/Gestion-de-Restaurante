import Reservacion from './reservacion.model.js';
import Cliente from '../cliente/cliente.model.js';
import Mesas from '../mesas/mesas.model.js';
import { encolarReservacion } from '../notificaciones/notificacion.service.js';

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

const mapEstado = (estado = 'PENDIENTE') => estado.toUpperCase();

const toPersistence = (data) => ({
  idCliente: data.clienteId,
  idMesa: data.mesaId,
  fechaReservacion: toDateOnly(data.fecha),
  horaInicio: data.horaInicio,
  horaFin: data.horaFin,
  cantidadPersonas: data.personas,
  estadoReservacion: mapEstado(data.estado),
  notas: data.notas || '',
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
    notas: reservacion.notas || '',
    fechaCreacion: reservacion.createdAt,
  };
};

const assertReferencesExist = async ({ clienteId, mesaId, personas }) => {
  const [clienteExists, mesa] = await Promise.all([
    Cliente.exists({ _id: clienteId, isActive: true }),
    Mesas.findById(mesaId),
  ]);

  if (!clienteExists) {
    throw new ReservacionError('CLIENT_NOT_FOUND', 'Cliente no encontrado', 404);
  }

  if (!mesa) {
    throw new ReservacionError('TABLE_NOT_FOUND', 'Mesa no encontrada', 404);
  }

  if (personas && mesa.Capacidad < personas) {
    throw new ReservacionError('TABLE_CAPACITY_EXCEEDED', 'La mesa no tiene capacidad suficiente', 409);
  }

  return mesa;
};

export const crearReservacion = async (data) => {
  const mesa = await assertReferencesExist(data);
  const conflict = await Reservacion.exists({
    idMesa: data.mesaId,
    fechaReservacion: toDateOnly(data.fecha),
    estadoReservacion: { $in: ['PENDIENTE', 'CONFIRMADA'] },
    horaInicio: { $lt: data.horaFin },
    horaFin: { $gt: data.horaInicio },
    isActive: true,
  });
  if (conflict) {
    throw new ReservacionError('TABLE_ALREADY_RESERVED', 'La mesa ya tiene una reserva en ese horario', 409);
  }

  const reservacion = await Reservacion.create(toPersistence(data));
  mesa.EstadoMesa = 'RESERVADA';
  await mesa.save();
  const populated = await populateReservacion(Reservacion.findById(reservacion._id));
  await encolarReservacion({
    reserva: mapReservacionDto(populated),
    cliente: populated.idCliente,
    estado: 'CREADA',
  });
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
  const current = await Reservacion.findById(id);
  if (!current) {
    throw new ReservacionError('RESERVATION_NOT_FOUND', 'Reservacion no encontrada', 404);
  }

  await assertReferencesExist(data);
  const reservacion = await Reservacion.findByIdAndUpdate(
    id,
    toPersistence(data),
    { new: true, runValidators: true }
  );

  if (!reservacion) {
    throw new ReservacionError('RESERVATION_NOT_FOUND', 'Reservacion no encontrada', 404);
  }

  if (current.idMesa.toString() !== data.mesaId.toString()) {
    const activeOnPreviousTable = await Reservacion.exists({
      _id: { $ne: current._id },
      idMesa: current.idMesa,
      estadoReservacion: { $in: ['PENDIENTE', 'CONFIRMADA'] },
      isActive: true,
    });
    if (!activeOnPreviousTable) {
      await Mesas.findByIdAndUpdate(current.idMesa, { EstadoMesa: 'DISPONIBLE' });
    }
  }
  if (['PENDIENTE', 'CONFIRMADA'].includes(reservacion.estadoReservacion)) {
    await Mesas.findByIdAndUpdate(reservacion.idMesa, { EstadoMesa: 'RESERVADA' });
  }

  const populated = await populateReservacion(Reservacion.findById(reservacion._id));
  await encolarReservacion({
    reserva: mapReservacionDto(populated),
    cliente: populated.idCliente,
    estado: reservacion.estadoReservacion,
  });
  return mapReservacionDto(populated);
};

const validStateTransitions = {
  PENDIENTE: ['CONFIRMADA', 'CANCELADA'],
  CONFIRMADA: ['COMPLETADA', 'CANCELADA'],
  CANCELADA: [],
  COMPLETADA: [],
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

  if (['CANCELADA', 'COMPLETADA'].includes(estado)) {
    await Mesas.findByIdAndUpdate(reservacion.idMesa, { EstadoMesa: 'DISPONIBLE' });
  } else {
    await Mesas.findByIdAndUpdate(reservacion.idMesa, { EstadoMesa: 'RESERVADA' });
  }

  const populated = await populateReservacion(Reservacion.findById(reservacion._id));
  await encolarReservacion({
    reserva: mapReservacionDto(populated),
    cliente: populated.idCliente,
    estado,
  });
  return mapReservacionDto(populated);
};

export const eliminarReservacion = async (id) => {
  const reservacion = await Reservacion.findByIdAndDelete(id);
  if (!reservacion) {
    throw new ReservacionError('RESERVATION_NOT_FOUND', 'Reservacion no encontrada', 404);
  }

  const activeOnTable = await Reservacion.exists({
    idMesa: reservacion.idMesa,
    estadoReservacion: { $in: ['PENDIENTE', 'CONFIRMADA'] },
    isActive: true,
  });
  if (!activeOnTable) {
    await Mesas.findByIdAndUpdate(reservacion.idMesa, { EstadoMesa: 'DISPONIBLE' });
  }

  return reservacion;
};

export const cancelarReservacion = async (id, razon = '') => {
  const reservacion = await Reservacion.findById(id);
  if (!reservacion) {
    throw new ReservacionError('RESERVATION_NOT_FOUND', 'Reservacion no encontrada', 404);
  }

  if (!['PENDIENTE', 'CONFIRMADA'].includes(reservacion.estadoReservacion)) {
    throw new ReservacionError(
      'INVALID_RESERVATION_STATUS_TRANSITION',
      `No se puede cancelar una reservacion en estado ${reservacion.estadoReservacion}`,
      409
    );
  }

  reservacion.estadoReservacion = 'CANCELADA';
  reservacion.razonCancelacion = razon || '';
  await reservacion.save();
  await Mesas.findByIdAndUpdate(reservacion.idMesa, { EstadoMesa: 'DISPONIBLE' });

  const populated = await populateReservacion(Reservacion.findById(reservacion._id));
  await encolarReservacion({
    reserva: mapReservacionDto(populated),
    cliente: populated.idCliente,
    estado: 'CANCELADA',
  });
  return mapReservacionDto(populated);
};

export const cancelarReservacionCliente = async (id, clienteId, razon = '') => {
  const reservacion = await Reservacion.findOne({ _id: id, idCliente: clienteId, isActive: true });
  if (!reservacion) {
    throw new ReservacionError('RESERVATION_NOT_FOUND', 'Reservacion no encontrada', 404);
  }
  return cancelarReservacion(id, razon);
};
