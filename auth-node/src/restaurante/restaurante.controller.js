import { createRestauranteRecord } from './restaurante.service.js';
import { getRestaurantesRecord } from './restaurante.service.js';
import { getConfiguracionRecord, updateConfiguracionRecord } from './restaurante.service.js';

export const createRestaurante = async (req, res) => {
  try {
    const restaurante = await createRestauranteRecord({
      restauranteData: req.body,
    });
    res.status(201).json({
      success: true,
      message: 'Restaurante registrado correctamente',
      data: restaurante,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error al registrar el restaurante',
      error: err.message,
    });
  }
};

export const getConfiguracion = async (_req, res) => {
  try {
    return res.status(200).json({ success: true, data: await getConfiguracionRecord() });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateConfiguracion = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: 'Configuracion actualizada',
      data: await updateConfiguracionRecord(req.body),
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getRestaurantes = async (req, res) => {
  try {
    const restaurantes = await getRestaurantesRecord();
    res.status(200).json({
      success: true,
      message: 'Restaurantes obtenidos correctamente',
      total: restaurantes.length,
      data: restaurantes,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener los restaurantes',
      error: err.message,
    });
  }
};
