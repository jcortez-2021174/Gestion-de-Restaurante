import {
  canjearRecompensa,
  crearRecompensa,
  editarRecompensa,
  eliminarRecompensa,
  listarRecompensas,
  obtenerResumenCliente,
} from './puntos.service.js';

const sendError = (res, error) => res.status(error.status || 500).json({
  success: false,
  code: error.code || 'LOYALTY_ERROR',
  message: error.message || 'Error en Puntos Aurea',
});

export const miResumen = async (req, res) => {
  try {
    return res.status(200).json({ success: true, data: await obtenerResumenCliente(req.cliente._id) });
  } catch (error) {
    return sendError(res, error);
  }
};

export const canjear = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      data: await canjearRecompensa(req.cliente._id, req.params.id),
    });
  } catch (error) {
    return sendError(res, error);
  }
};

export const listarAdmin = async (_req, res) => {
  try {
    return res.status(200).json({ success: true, data: await listarRecompensas() });
  } catch (error) {
    return sendError(res, error);
  }
};

export const crearAdmin = async (req, res) => {
  try {
    return res.status(201).json({ success: true, data: await crearRecompensa(req.body) });
  } catch (error) {
    return sendError(res, error);
  }
};

export const editarAdmin = async (req, res) => {
  try {
    return res.status(200).json({ success: true, data: await editarRecompensa(req.params.id, req.body) });
  } catch (error) {
    return sendError(res, error);
  }
};

export const eliminarAdmin = async (req, res) => {
  try {
    await eliminarRecompensa(req.params.id);
    return res.status(200).json({ success: true, message: 'Recompensa eliminada' });
  } catch (error) {
    return sendError(res, error);
  }
};
