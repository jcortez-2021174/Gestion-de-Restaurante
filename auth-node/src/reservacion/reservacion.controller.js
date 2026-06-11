import {
  crearReservacion,
  listarReservaciones,
  obtenerReservacionPorId,
  actualizarReservacion,
  eliminarReservacion,
  listarReservacionesPorCliente,
  listarReservacionesPorMesa,
  cambiarEstadoReservacion,
  cancelarReservacion,
  cancelarReservacionCliente,
} from './reservacion.service.js';

const sendError = (res, error, fallbackMessage) => res
  .status(error.status || 500)
  .json({
    success: false,
    code: error.code || 'RESERVATION_ERROR',
    message: error.message || fallbackMessage,
  });

const reservationPayload = (body) => ({
  clienteId: body.clienteId,
  mesaId: body.mesaId,
  fecha: body.fecha,
  horaInicio: body.horaInicio,
  horaFin: body.horaFin,
  personas: body.personas,
  estado: body.estado,
  notas: body.notas,
});

export const agregarReservacion = async (req, res) => {
  try {
    const reservacion = await crearReservacion(reservationPayload(req.body));
    return res.status(201).json({
      success: true,
      message: 'Reservacion creada correctamente',
      data: reservacion,
    });
  } catch (error) {
    return sendError(res, error, 'No se pudo crear la reservacion');
  }
};

export const agregarMiReservacion = async (req, res) => {
  try {
    const reservacion = await crearReservacion({
      ...reservationPayload(req.body),
      clienteId: req.cliente._id,
    });
    return res.status(201).json({ success: true, data: reservacion });
  } catch (error) {
    return sendError(res, error, 'No se pudo crear la reservacion');
  }
};

export const listarMisReservaciones = async (req, res) => {
  try {
    const reservaciones = await listarReservacionesPorCliente(req.cliente._id);
    return res.status(200).json({ success: true, total: reservaciones.length, data: reservaciones });
  } catch (error) {
    return sendError(res, error, 'No se pudieron listar tus reservaciones');
  }
};

export const cancelarMiReservacion = async (req, res) => {
  try {
    const reservacion = await cancelarReservacionCliente(
      req.params.id,
      req.cliente._id,
      req.body.razon
    );
    return res.status(200).json({ success: true, data: reservacion });
  } catch (error) {
    return sendError(res, error, 'No se pudo cancelar la reservacion');
  }
};

export const listarReservacionesCtrl = async (req, res) => {
  try {
    const reservaciones = await listarReservaciones(req.query);
    return res.status(200).json({
      success: true,
      total: reservaciones.length,
      data: reservaciones,
    });
  } catch (error) {
    return sendError(res, error, 'No se pudieron listar las reservaciones');
  }
};

export const obtenerReservacionPorIdCtrl = async (req, res) => {
  try {
    const reservacion = await obtenerReservacionPorId(req.params.id);
    return res.status(200).json({ success: true, data: reservacion });
  } catch (error) {
    return sendError(res, error, 'No se pudo obtener la reservacion');
  }
};

export const editarReservacion = async (req, res) => {
  try {
    const reservacion = await actualizarReservacion(req.params.id, reservationPayload(req.body));
    return res.status(200).json({
      success: true,
      message: 'Reservacion actualizada correctamente',
      data: reservacion,
    });
  } catch (error) {
    return sendError(res, error, 'No se pudo actualizar la reservacion');
  }
};

export const eliminarReservacionCtrl = async (req, res) => {
  try {
    await eliminarReservacion(req.params.id);
    return res.status(200).json({
      success: true,
      message: 'Reservacion eliminada correctamente',
    });
  } catch (error) {
    return sendError(res, error, 'No se pudo eliminar la reservacion');
  }
};

export const listarReservacionesPorClienteCtrl = async (req, res) => {
  try {
    const reservaciones = await listarReservacionesPorCliente(req.params.clienteId);
    return res.status(200).json({
      success: true,
      total: reservaciones.length,
      data: reservaciones,
    });
  } catch (error) {
    return sendError(res, error, 'No se pudieron listar las reservaciones del cliente');
  }
};

export const listarReservacionesPorMesaCtrl = async (req, res) => {
  try {
    const reservaciones = await listarReservacionesPorMesa(req.params.mesaId, req.query.fecha);
    return res.status(200).json({
      success: true,
      total: reservaciones.length,
      data: reservaciones,
    });
  } catch (error) {
    return sendError(res, error, 'No se pudieron listar las reservaciones de la mesa');
  }
};

export const cambiarEstadoReservacionCtrl = async (req, res) => {
  try {
    const reservacion = await cambiarEstadoReservacion(req.params.id, req.body.estado);
    return res.status(200).json({ success: true, data: reservacion });
  } catch (error) {
    return sendError(res, error, 'No se pudo cambiar el estado de la reservacion');
  }
};

export const cancelarReservacionCtrl = async (req, res) => {
  try {
    const reservacion = await cancelarReservacion(req.params.id, req.body.razon);
    return res.status(200).json({ success: true, data: reservacion });
  } catch (error) {
    return sendError(res, error, 'No se pudo cancelar la reservacion');
  }
};
