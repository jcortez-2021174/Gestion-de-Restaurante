import { body, param } from 'express-validator';
import { checkValidators } from './check-validators.js';
import { ESTADOS_PEDIDO } from '../src/pedido/pedido.constants.js';

const rejectUnexpectedFields = (allowedFields) => (req, res, next) => {
  const unexpectedFields = Object.keys(req.body || {})
    .filter((field) => !allowedFields.includes(field));

  if (unexpectedFields.length > 0) {
    return res.status(400).json({
      success: false,
      code: 'ORDER_FIELDS_NOT_ALLOWED',
      message: `Campos no permitidos: ${unexpectedFields.join(', ')}`,
    });
  }

  next();
};

const validateProductFields = (req, res, next) => {
  const invalidItem = (req.body.productos || []).find((item) => {
    const fields = Object.keys(item || {});
    return fields.some((field) => !['productoId', 'cantidad'].includes(field));
  });

  if (invalidItem) {
    return res.status(400).json({
      success: false,
      code: 'ORDER_PRODUCT_FIELDS_NOT_ALLOWED',
      message: 'Cada producto solo puede incluir productoId y cantidad',
    });
  }

  next();
};

export const validateCreatePedido = [
  rejectUnexpectedFields(['mesaId', 'productos']),
  validateProductFields,
  body('mesaId')
    .optional({ nullable: true })
    .isMongoId().withMessage('mesaId no es un ObjectId valido'),
  body('productos')
    .isArray({ min: 1, max: 50 })
    .withMessage('El pedido debe contener entre 1 y 50 productos'),
  body('productos.*.productoId')
    .isMongoId().withMessage('productoId no es un ObjectId valido'),
  body('productos.*.cantidad')
    .isInt({ min: 1, max: 100 })
    .withMessage('cantidad debe ser un entero entre 1 y 100'),
  checkValidators,
];

export const validatePedidoId = [
  param('id').isMongoId().withMessage('Id pedido no valido'),
  checkValidators,
];

export const validateEstadoPedido = [
  rejectUnexpectedFields(['estado']),
  body('estado')
    .isIn(ESTADOS_PEDIDO)
    .withMessage('Estado de pedido no valido'),
  checkValidators,
];
