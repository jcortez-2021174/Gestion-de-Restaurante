import { body } from 'express-validator';
import { param } from 'express-validator';
import { checkValidators } from './check-validators.js';

export const validateCreateRestaurante = [
  body('nombre')
    .trim()
    .notEmpty()
    .withMessage('El nombre del restaurante es requerido')
    .isLength({ min: 2, max: 150 })
    .withMessage('El nombre debe tener entre 2 y 150 caracteres'),
  body('direccion')
    .trim()
    .notEmpty()
    .withMessage('La dirección del restaurante es requerida')
    .isLength({ min: 5, max: 300 })
    .withMessage('La dirección debe tener entre 5 y 300 caracteres'),
  body('capacidadTotal')
    .notEmpty()
    .withMessage('La capacidad total es requerida')
    .isInt({ min: 1 })
    .withMessage('La capacidad total debe ser un número entero positivo mayor a 0'),
  checkValidators,
];

export const validateUpdateRestaurante = [
  param('id')
    .isMongoId()
    .withMessage('El ID del restaurante no es válido'),
  body('nombre')
    .optional()
    .trim()
    .isLength({ min: 2, max: 150 })
    .withMessage('El nombre debe tener entre 2 y 150 caracteres'),
  body('direccion')
    .optional()
    .trim()
    .isLength({ min: 5, max: 300 })
    .withMessage('La dirección debe tener entre 5 y 300 caracteres'),
  body('capacidadTotal')
    .optional()
    .isInt({ min: 1 })
    .withMessage('La capacidad total debe ser un número entero positivo mayor a 0'),
  checkValidators,
];

export const validateRestauranteId = [
  param('id')
    .isMongoId()
    .withMessage('El ID del restaurante no es válido'),
  checkValidators,
];