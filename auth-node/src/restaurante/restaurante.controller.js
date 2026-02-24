import { createRestauranteRecord } from './restaurante.service.js';
import { getRestaurantesRecord } from './restaurante.service.js';

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
