import { validationResult } from 'express-validator';
import { crearCliente, listarClientes } from './cliente.service.js';


export const agregarCliente = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { nombre, apellido, telefono, correo, direccion } = req.body;

    const nuevoCliente = await crearCliente({ 
        nombre, 
        apellido, 
        telefono, 
        correo, 
        direccion 
    });

    return res.status(201).json({
      success: true,
      message: 'Cliente registrado correctamente en Áurea Restaurant',
      data: nuevoCliente,
    });
  } catch (error) {
  
    if (error.code === 11000) { 
        return res.status(400).json({ 
            success: false, 
            message: 'El correo electrónico ya está registrado' 
        });
    }
    
    if (error.name === 'ValidationError') {
      const mensajes = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: mensajes.join(', ') });
    }

    return res.status(500).json({ 
        success: false, 
        message: 'Error interno del servidor', 
        error: error.message 
    });
  }
};


export const listarClientesCtrl = async (req, res) => {
  try {
    const clientes = await listarClientes();
    return res.status(200).json({
      success: true,
      total: clientes.length,
      data: clientes,
    });
  } catch (error) {
    return res.status(500).json({ 
        success: false, 
        message: 'Error interno del servidor', 
        error: error.message 
    });
  }
};