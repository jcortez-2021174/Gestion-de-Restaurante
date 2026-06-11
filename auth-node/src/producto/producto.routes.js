import { Router } from 'express';
import { body } from 'express-validator';
import { agregarProducto, listarProductosCtrl, obtenerProductoPorIdCtrl, actualizarProductoCtrl, eliminarProductoCtrl } from './producto.controller.js';

const router = Router();

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

/**
 * @swagger
 * components:
 *   schemas:
 *     Producto:
 *       type: object
 *       required:
 *         - nombre
 *         - precio
 *         - idCategoria
 *       properties:
 *         _id:
 *           type: string
 *           description: ID autogenerado
 *         nombre:
 *           type: string
 *           description: Nombre del producto
 *         precio:
 *           type: number
 *           minimum: 0
 *           description: Precio del producto
 *         disponibilidad:
 *           type: string
 *           enum: [Disponible, NoDisponible]
 *           default: Disponible
 *           description: Disponibilidad del producto
 *         idCategoria:
 *           type: string
 *           description: ID de la categoría a la que pertenece
 *       example:
 *         nombre: "Tacos de res"
 *         precio: 35.00
 *         disponibilidad: "Disponible"
 *         idCategoria: "664f1b2c9a4e2d001f3a8b10"
 */

/**
 * @swagger
 * /producto:
 *   post:
 *     summary: Crear un producto
 *     tags: [Producto]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Producto'
 *     responses:
 *       201:
 *         description: Producto creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Producto'
 *       400:
 *         description: Error de validación
 *       500:
 *         description: Error del servidor
 */
router.post('/', validarProducto, agregarProducto);

/**
 * @swagger
 * /producto:
 *   get:
 *     summary: Obtener todos los productos
 *     tags: [Producto]
 *     responses:
 *       200:
 *         description: Lista de productos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Producto'
 *       500:
 *         description: Error del servidor
 */
router.get('/', listarProductosCtrl);

/**
 * @swagger
 * /producto/{id}:
 *   get:
 *     summary: Obtener un producto por ID
 *     tags: [Producto]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Producto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Producto'
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error del servidor
 */
router.get('/:id', obtenerProductoPorIdCtrl);

/**
 * @swagger
 * /producto/{id}:
 *   put:
 *     summary: Actualizar un producto
 *     tags: [Producto]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Producto'
 *     responses:
 *       200:
 *         description: Producto actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Producto'
 *       400:
 *         description: Error de validación
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error del servidor
 */
router.put('/:id', validarProducto, actualizarProductoCtrl);

/**
 * @swagger
 * /producto/{id}:
 *   delete:
 *     summary: Eliminar un producto
 *     tags: [Producto]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Producto eliminado correctamente
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error del servidor
 */
router.delete('/:id', eliminarProductoCtrl);

export default router;