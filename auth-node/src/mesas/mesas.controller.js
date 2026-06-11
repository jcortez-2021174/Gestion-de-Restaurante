import * as mesasService from './mesas.service.js';

const sendError = (res, error, fallbackMessage) => res
  .status(error.status || 400)
  .json({
    success: false,
    code: error.code || 'TABLE_ERROR',
    message: error.message || fallbackMessage,
  });

export const crearMesa = async (req, res) => {
  try {
    const mesa = await mesasService.crearMesa(req.body);
    return res.status(201).json({ success: true, data: mesa });
  } catch (error) {
    return sendError(res, error, 'No se pudo crear la mesa');
  }
};

export const editarMesa = async (req, res) => {
  try {
    const mesa = await mesasService.editarMesa(req.params.id, req.body);
    return res.status(200).json({ success: true, data: mesa });
  } catch (error) {
    return sendError(res, error, 'No se pudo actualizar la mesa');
  }
};

export const eliminarMesa = async (req, res) => {
  try {
    await mesasService.eliminarMesa(req.params.id);
    return res.status(200).json({
      success: true,
      message: 'Mesa eliminada correctamente',
    });
  } catch (error) {
    return sendError(res, error, 'No se pudo eliminar la mesa');
  }
};

export const listarMesas = async (req, res) => {
  try {
    const mesas = await mesasService.listarMesas(req.query);
    return res.status(200).json({
      success: true,
      total: mesas.length,
      data: mesas,
    });
  } catch (error) {
    return sendError(res, error, 'No se pudieron listar las mesas');
  }
};

export const obtenerMesa = async (req, res) => {
  try {
    const mesa = await mesasService.obtenerMesa(req.params.id);
    return res.status(200).json({ success: true, data: mesa });
  } catch (error) {
    return sendError(res, error, 'No se pudo obtener la mesa');
  }
};
