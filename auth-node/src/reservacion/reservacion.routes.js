import { Router } from 'express';
import { body, param, query } from 'express-validator';
import {
  agregarReservacion,
  listarReservacionesCtrl,
  editarReservacion,
  eliminarReservacionCtrl,
  obtenerReservacionPorIdCtrl,
  listarReservacionesPorClienteCtrl,
  listarReservacionesPorMesaCtrl,
  cambiarEstadoReservacionCtrl,
  cancelarReservacionCtrl,
  agregarMiReservacion,
  listarMisReservaciones,
  cancelarMiReservacion,
} from './reservacion.controller.js';
import { validateJWT } from '../../middlewares/validate-jwt.js';
import { authorizeRole } from '../../middlewares/authorize-role.js';
import { checkValidators } from '../../middlewares/check-validators.js';
import { resolveCliente } from '../../middlewares/resolve-cliente.js';

const router = Router();

const validateReservationPayload = [
  body('clienteId').notEmpty().withMessage('clienteId es requerido').isMongoId(),
  body('mesaId').notEmpty().withMessage('mesaId es requerido').isMongoId(),
  body('fecha').notEmpty().withMessage('fecha es requerida').isISO8601(),
  body('horaInicio').notEmpty().withMessage('horaInicio es requerida').matches(/^([01]\d|2[0-3]):[0-5]\d$/),
  body('horaFin').notEmpty().withMessage('horaFin es requerida').matches(/^([01]\d|2[0-3]):[0-5]\d$/),
  body('personas').isInt({ min: 1, max: 50 }),
  body('estado').optional().isIn(['PENDIENTE', 'CONFIRMADA', 'CANCELADA', 'COMPLETADA']),
  body('notas').optional().isString().isLength({ max: 500 }),
  checkValidators,
];

const validateReservationId = [
  param('id').isMongoId().withMessage('id de reservacion no valido'),
  checkValidators,
];

const validateClienteId = [
  param('clienteId').isMongoId().withMessage('clienteId no valido'),
  checkValidators,
];

const validateMesaId = [
  param('mesaId').isMongoId().withMessage('mesaId no valido'),
  query('fecha').optional().isISO8601().withMessage('fecha no valida'),
  checkValidators,
];

const validateEstado = [
  body('estado').isIn(['PENDIENTE', 'CONFIRMADA', 'CANCELADA', 'COMPLETADA']),
  checkValidators,
];

const validateCustomerPayload = validateReservationPayload.filter((validator, index) => index !== 0);

router.post('/mis-reservaciones', validateJWT, resolveCliente, validateCustomerPayload, agregarMiReservacion);
router.get('/mis-reservaciones', validateJWT, resolveCliente, listarMisReservaciones);
router.patch('/mis-reservaciones/:id/cancelar', validateJWT, resolveCliente, validateReservationId, cancelarMiReservacion);

router.use(validateJWT, authorizeRole('ADMIN_ROLE'));

router.post('/', validateReservationPayload, agregarReservacion);
router.get('/', listarReservacionesCtrl);
router.get('/cliente/:clienteId', validateClienteId, listarReservacionesPorClienteCtrl);
router.get('/mesa/:mesaId', validateMesaId, listarReservacionesPorMesaCtrl);
router.get('/:id', validateReservationId, obtenerReservacionPorIdCtrl);
router.put('/:id', validateReservationId, validateReservationPayload, editarReservacion);
router.delete('/:id', validateReservationId, eliminarReservacionCtrl);
router.patch('/:id/estado', validateReservationId, validateEstado, cambiarEstadoReservacionCtrl);
router.patch('/:id/cancelar', validateReservationId, cancelarReservacionCtrl);

export default router;
