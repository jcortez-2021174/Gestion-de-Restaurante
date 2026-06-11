import { Router } from 'express';
import { body, param } from 'express-validator';
import { validateJWT } from '../../middlewares/validate-jwt.js';
import { resolveCliente } from '../../middlewares/resolve-cliente.js';
import { authorizeRole } from '../../middlewares/authorize-role.js';
import { checkValidators } from '../../middlewares/check-validators.js';
import {
  canjear,
  crearAdmin,
  editarAdmin,
  eliminarAdmin,
  listarAdmin,
  miResumen,
} from './puntos.controller.js';

const router = Router();
const idValidation = [param('id').isMongoId(), checkValidators];
const rewardValidation = [
  body('nombre').trim().isLength({ min: 3, max: 100 }),
  body('descripcion').optional().trim().isLength({ max: 500 }),
  body('imagen').optional().isString(),
  body('puntosRequeridos').isInt({ min: 1 }),
  body('activa').optional().isBoolean(),
  checkValidators,
];

router.get('/me', validateJWT, resolveCliente, miResumen);
router.post('/recompensas/:id/canjear', validateJWT, resolveCliente, idValidation, canjear);

router.use('/admin', validateJWT, authorizeRole('ADMIN_ROLE'));
router.get('/admin/recompensas', listarAdmin);
router.post('/admin/recompensas', rewardValidation, crearAdmin);
router.put('/admin/recompensas/:id', idValidation, rewardValidation, editarAdmin);
router.delete('/admin/recompensas/:id', idValidation, eliminarAdmin);

export default router;
