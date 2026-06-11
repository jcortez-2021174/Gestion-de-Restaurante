import { obtenerClientePorAuthUserId } from '../src/cliente/cliente.service.js';

export const createResolveCliente = ({
  findByAuthUserId = obtenerClientePorAuthUserId,
} = {}) => {
  return async (req, res, next) => {
    try {
      const authUserId = req.auth?.userId;
      if (!authUserId) {
        return res.status(401).json({
          success: false,
          code: 'AUTH_IDENTITY_MISSING',
          message: 'No se encontro la identidad autenticada',
        });
      }

      const cliente = await findByAuthUserId(authUserId);
      if (!cliente) {
        return res.status(404).json({
          success: false,
          code: 'CLIENTE_NOT_PROVISIONED',
          message: 'El usuario autenticado no tiene un cliente vinculado',
        });
      }

      req.cliente = cliente;
      next();
    } catch {
      return res.status(500).json({
        success: false,
        code: 'CLIENTE_RESOLUTION_ERROR',
        message: 'No se pudo resolver la identidad del cliente',
      });
    }
  };
};

export const resolveCliente = createResolveCliente();
