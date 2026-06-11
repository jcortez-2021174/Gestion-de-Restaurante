import  Cliente  from './cliente.model.js';
import { registrarEventoAdmin } from '../notificaciones/notificacion.service.js';

const normalizeEmail = (correo) => correo.trim().toLowerCase();

const identityConflict = (message) => {
  const error = new Error(message);
  error.code = 'IDENTITY_CONFLICT';
  return error;
};

export const crearCliente = async (data) => {
  const cliente = new Cliente(data);
  return await cliente.save();
};

export const obtenerClientePorAuthUserId = async (authUserId) => {
  if (!authUserId) {
    return null;
  }

  return await Cliente.findOne({ authUserId, isActive: true });
};

export const provisionarCliente = async (data) => {
  const {
    authUserId,
    nombre,
    apellido,
    correo,
    telefono,
  } = data;

  const normalizedEmail = normalizeEmail(correo);
  const identityData = {
    nombre: nombre.trim(),
    apellido: apellido.trim(),
    correo: normalizedEmail,
    telefono: telefono.trim(),
    isActive: true,
  };

  const clientePorIdentidad = await Cliente.findOne({ authUserId });
  if (clientePorIdentidad) {
    Object.assign(clientePorIdentidad, identityData);
    await clientePorIdentidad.save();
    return { cliente: clientePorIdentidad, created: false };
  }

  const clientePorCorreo = await Cliente.findOne({ correo: normalizedEmail });
  if (clientePorCorreo) {
    if (clientePorCorreo.authUserId && clientePorCorreo.authUserId !== authUserId) {
      throw identityConflict('El correo ya pertenece a otra identidad');
    }

    clientePorCorreo.authUserId = authUserId;
    Object.assign(clientePorCorreo, identityData);
    await clientePorCorreo.save();
    return { cliente: clientePorCorreo, created: false };
  }

  try {
    const cliente = await Cliente.create({
      authUserId,
      ...identityData,
    });

    registrarEventoAdmin({
      evento: 'CLIENTE_REGISTRADO',
      asunto: 'Nuevo cliente registrado',
      resumen: `${cliente.nombre} ${cliente.apellido} se unio a Aurea.`,
      categoria: 'CUENTA',
      referencia: `cliente:${cliente._id}:registrado`,
    }).catch((error) => {
      console.error('No se pudo registrar la notificacion administrativa del cliente:', error.message);
    });

    return { cliente, created: true };
  } catch (error) {
    if (error.code !== 11000) {
      throw error;
    }

    const cliente = await Cliente.findOne({ authUserId });
    if (cliente) {
      return { cliente, created: false };
    }

    throw identityConflict('La identidad no pudo vincularse por un conflicto de datos');
  }
};


export const listarClientes = async () => {
  return await Cliente.find()
    .sort({ createdAt: -1 });
};

export const editarCliente = async (id, data) => {
  return await Cliente.findByIdAndUpdate(
    id,
    data,
    { new: true, runValidators: true }
  );
};

export const eliminarCliente = async (id) => {
  const cliente = await Cliente.findById(id);
  if (!cliente) return null;

  if (cliente.authUserId) {
    cliente.isActive = false;
    await cliente.save();
    return cliente;
  }

  return Cliente.findByIdAndDelete(id);
};
