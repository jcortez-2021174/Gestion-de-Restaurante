import express from 'express';
import { body, param, query } from 'express-validator';
import { crearMesa, editarMesa, eliminarMesa, listarMesas, obtenerMesa } from './mesas.controller.js';
import { validateJWT } from '../../middlewares/validate-jwt.js';
import { authorizeRole } from '../../middlewares/authorize-role.js';
import { checkValidators } from '../../middlewares/check-validators.js';

const router = express.Router();

const validateMesaPayload = [
  body('numero').isInt({ min: 1, max: 99 }).withMessage('numero debe ser un entero positivo'),
  body('capacidad').isInt({ min: 1, max: 50 }).withMessage('capacidad debe ser un entero positivo'),
  body('estado').optional().isIn(['DISPONIBLE', 'RESERVADA', 'OCUPADA', 'FUERA_SERVICIO']),
  body('zona').optional().isIn(['TERRAZA', 'INTERIOR', 'VIP', 'EVENTOS']),
  body('forma').optional().isIn(['CIRCULO', 'RECTANGULO']),
  body('posicion.x').optional().isFloat({ min: 0, max: 100 }),
  body('posicion.y').optional().isFloat({ min: 0, max: 100 }),
  checkValidators,
];

const validateMesaId = [
  param('id').isMongoId().withMessage('id de mesa no valido'),
  checkValidators,
];

const validateFilters = [
  query('estado').optional().isIn(['DISPONIBLE', 'RESERVADA', 'OCUPADA', 'FUERA_SERVICIO']),
  query('zona').optional().isIn(['TERRAZA', 'INTERIOR', 'VIP', 'EVENTOS']),
  query('capacidad').optional().isInt({ min: 1 }),
  checkValidators,
];

router.get(
  '/disponibles',
  validateJWT,
  (req, _res, next) => {
    req.query.incluirReservadas = 'true';
    next();
  },
  validateFilters,
  listarMesas
);

router.use(validateJWT, authorizeRole('ADMIN_ROLE'));

router.post('/', validateMesaPayload, crearMesa);
router.get('/', validateFilters, listarMesas);
router.get('/:id', validateMesaId, obtenerMesa);
router.put('/:id', validateMesaId, validateMesaPayload, editarMesa);
router.delete('/:id', validateMesaId, eliminarMesa);

export default router;
