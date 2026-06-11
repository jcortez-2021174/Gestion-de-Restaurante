import { provisionarCliente } from '../cliente/cliente.service.js';

const toClienteIdentityDto = (cliente) => ({
  id: cliente._id.toString(),
  authUserId: cliente.authUserId,
  nombre: cliente.nombre,
  apellido: cliente.apellido,
  correo: cliente.correo,
  telefono: cliente.telefono,
});

export const provisionCliente = async (req, res) => {
  try {
    const result = await provisionarCliente(req.body);

    return res.status(result.created ? 201 : 200).json({
      success: true,
      data: toClienteIdentityDto(result.cliente),
    });
  } catch (error) {
    if (error.code === 'IDENTITY_CONFLICT' || error.code === 11000) {
      return res.status(409).json({
        success: false,
        code: 'IDENTITY_CONFLICT',
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      code: 'IDENTITY_PROVISIONING_ERROR',
      message: 'No se pudo aprovisionar el cliente',
    });
  }
};
