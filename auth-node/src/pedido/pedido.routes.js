import { Router } from 'express';
import {
  agregarPedidoCtrl,
  cambiarEstadoPedidoCtrl,
  listarPedidosCtrl,
  obtenerMisPedidosCtrl,
  obtenerPedidoPorIdCtrl,
} from './pedido.controller.js';
import {
  validateCreatePedido,
  validateEstadoPedido,
  validatePedidoId,
} from '../../middlewares/pedido-validator.js';
import { validateJWT } from '../../middlewares/validate-jwt.js';
import { resolveCliente } from '../../middlewares/resolve-cliente.js';
import { authorizeRole } from '../../middlewares/authorize-role.js';

const router = Router();
const requireAdmin = authorizeRole('ADMIN_ROLE');

router.post(
  '/',
  validateJWT,
  resolveCliente,
  validateCreatePedido,
  agregarPedidoCtrl
);

router.get(
  '/mis-pedidos',
  validateJWT,
  resolveCliente,
  obtenerMisPedidosCtrl
);

router.get('/', validateJWT, requireAdmin, listarPedidosCtrl);

router.get('/:id', validateJWT, requireAdmin, validatePedidoId, obtenerPedidoPorIdCtrl);

router.patch(
  '/:id/estado',
  validateJWT,
  requireAdmin,
  validatePedidoId,
  validateEstadoPedido,
  cambiarEstadoPedidoCtrl
);

export default router;
