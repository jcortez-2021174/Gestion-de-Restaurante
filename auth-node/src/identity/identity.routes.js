import { Router } from 'express';
import { body } from 'express-validator';
import { checkValidators } from '../../middlewares/check-validators.js';
import { validateInternalApiKey } from '../../middlewares/validate-internal-api-key.js';
import { provisionCliente } from './identity.controller.js';

const router = Router();

const validateProvisioningPayload = [
  body('authUserId')
    .trim()
    .notEmpty().withMessage('authUserId es requerido')
    .isLength({ max: 100 }).withMessage('authUserId es demasiado largo'),
  body('nombre')
    .trim()
    .notEmpty().withMessage('nombre es requerido')
    .isLength({ max: 50 }).withMessage('nombre es demasiado largo'),
  body('apellido')
    .trim()
    .notEmpty().withMessage('apellido es requerido')
    .isLength({ max: 50 }).withMessage('apellido es demasiado largo'),
  body('correo')
    .trim()
    .isEmail().withMessage('correo no es valido')
    .normalizeEmail(),
  body('telefono')
    .trim()
    .isLength({ min: 8, max: 15 })
    .withMessage('telefono debe tener entre 8 y 15 caracteres'),
  checkValidators,
];

router.post(
  '/clientes/provision',
  validateInternalApiKey,
  validateProvisioningPayload,
  provisionCliente
);

export default router;
