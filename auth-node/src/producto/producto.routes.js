import { Router } from 'express';
import { body } from 'express-validator';
import { agregarProducto, listarProductosCtrl } from './producto.controller.js';

const router = Router();

// Validaciones para agregar producto
const validarProducto = [
  body('nombre')
    .notEmpty().withMessage('El nombre es obligatorio')
    .isString().withMessage('El nombre debe ser texto'),
  body('precio')
    .notEmpty().withMessage('El precio es obligatorio')
    .isFloat({ min: 0 }).withMessage('El precio debe ser un número mayor o igual a 0'),
  body('disponibilidad')
    .optional()
    .isIn(['Disponible', 'NoDisponible']).withMessage('La disponibilidad debe ser "Disponible" o "NoDisponible"'),
  body('idCategoria')
    .notEmpty().withMessage('El idCategoria es obligatorio')
    .isMongoId().withMessage('El idCategoria no es un ObjectId válido'),
];

// POST /api/productos  → Agregar producto
router.post('/', validarProducto, agregarProducto);

// GET  /api/productos  → Listar productos
router.get('/', listarProductosCtrl);

export default router;
