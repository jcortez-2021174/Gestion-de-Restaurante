import { validationResult } from 'express-validator';
import { crearProducto, listarProductos, obtenerProductoPorId, actualizarProducto, eliminarProducto } from './producto.service.js';

export const agregarProducto = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { nombre, precio, disponibilidad, idCategoria } = req.body;

    const nuevoProducto = await crearProducto({ nombre, precio, disponibilidad, idCategoria });

    return res.status(201).json({
      success: true,
      message: 'Producto creado correctamente',
      data: nuevoProducto,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const mensajes = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: mensajes.join(', ') });
    }
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'El idCategoria no es un ObjectId válido' });
    }
    return res.status(500).json({ success: false, message: 'Error interno del servidor', error: error.message });
  }
};

export const listarProductosCtrl = async (req, res) => {
  try {
    const productos = await listarProductos();
    return res.status(200).json({
      success: true,
      total: productos.length,
      data: productos,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error interno del servidor', error: error.message });
  }
};

export const obtenerProductoPorIdCtrl = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await obtenerProductoPorId(id);

    if (!producto) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado',
      });
    }

    return res.status(200).json({
      success: true,
      data: producto,
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'ID inválido' });
    }
    return res.status(500).json({ success: false, message: 'Error interno del servidor', error: error.message });
  }
};

export const actualizarProductoCtrl = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { id } = req.params;
    const producto = await actualizarProducto(id, req.body);

    if (!producto) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Producto actualizado correctamente',
      data: producto,
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

export const eliminarProductoCtrl = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await eliminarProducto(id);

    if (!producto) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Producto eliminado correctamente',
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'ID inválido' });
    }
    return res.status(500).json({ success: false, message: 'Error interno del servidor', error: error.message });
  }
};
