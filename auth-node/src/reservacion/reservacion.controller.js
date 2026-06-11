import { validationResult } from 'express-validator';
import {
  crearReservacion,
  listarReservaciones,
  obtenerReservacionPorId,
  actualizarReservacion,
  eliminarReservacion,
  listarReservacionesPorCliente,
  listarReservacionesPorMesa,
  cambiarEstadoReservacion,
  cancelarReservacion
} from './reservacion.service.js';

export const agregarReservacion = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { fechaReservacion, cantidadPersonas, idCliente, idMesa } = req.body;

    const nuevaReservacion = await crearReservacion({ 
      fechaReservacion, 
      cantidadPersonas, 
      idCliente, 
      idMesa 
    });

    return res.status(201).json({
      success: true,
      message: 'Reservación creada correctamente',
      data: nuevaReservacion,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const mensajes = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: mensajes.join(', ') });
    }
    return res.status(500).json({ success: false, message: 'Error interno del servidor', error: error.message });
  }
};

export const listarReservacionesCtrl = async (req, res) => {
  try {
    const reservaciones = await listarReservaciones();
    return res.status(200).json({
      success: true,
      total: reservaciones.length,
      data: reservaciones,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error interno del servidor', error: error.message });
  }
};

export const obtenerReservacionPorIdCtrl = async (req, res) => {
  try {
    const { id } = req.params;
    const reservacion = await obtenerReservacionPorId(id);

    if (!reservacion) {
      return res.status(404).json({
        success: false,
        message: 'Reservación no encontrada',
      });
    }

    return res.status(200).json({
      success: true,
      data: reservacion,
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'ID inválido' });
    }
    return res.status(500).json({ success: false, message: 'Error interno del servidor', error: error.message });
  }
};

export const editarReservacion = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { id } = req.params;
    const reservacion = await actualizarReservacion(id, req.body);

    if (!reservacion) {
      return res.status(404).json({
        success: false,
        message: 'Reservación no encontrada',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Reservación actualizada correctamente',
      data: reservacion,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const mensajes = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: mensajes.join(', ') });
    }
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'ID inválido' });
    }
    return res.status(500).json({ success: false, message: 'Error interno del servidor', error: error.message });
  }
};

export const eliminarReservacionCtrl = async (req, res) => {
  try {
    const { id } = req.params;
    const reservacion = await eliminarReservacion(id);

    if (!reservacion) {
      return res.status(404).json({
        success: false,
        message: 'Reservación no encontrada',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Reservación eliminada correctamente',
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'ID inválido' });
    }
    return res.status(500).json({ success: false, message: 'Error interno del servidor', error: error.message });
  }
};

export const listarReservacionesPorClienteCtrl = async (req, res) => {
  try {
    const { clienteId } = req.params;
    const reservaciones = await listarReservacionesPorCliente(clienteId);
    return res.status(200).json({
      success: true,
      total: reservaciones.length,
      data: reservaciones,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error interno del servidor', error: error.message });
  }
};

export const listarReservacionesPorMesaCtrl = async (req, res) => {
  try {
    const { mesaId } = req.params;
    const { fecha } = req.query;
    const reservaciones = await listarReservacionesPorMesa(mesaId, fecha);
    return res.status(200).json({
      success: true,
      total: reservaciones.length,
      data: reservaciones,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error interno del servidor', error: error.message });
  }
};

export const cambiarEstadoReservacionCtrl = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    if (!estado) {
      return res.status(400).json({ msg: "El campo 'estado' es requerido" });
    }

    const reservacion = await cambiarEstadoReservacion(id, estado);
    res.json(reservacion);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const cancelarReservacionCtrl = async (req, res) => {
  try {
    const { id } = req.params;
    const { razon } = req.body;

    const reservacion = await cancelarReservacion(id, razon);
    res.json(reservacion);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
