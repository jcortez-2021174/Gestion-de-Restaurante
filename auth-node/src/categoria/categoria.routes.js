import express from 'express';
const router = express.Router();
import categoriaController from './categoria.controller.js';
import { validateJWT } from '../../middlewares/validate-jwt.js';
import { authorizeRole } from '../../middlewares/authorize-role.js';

const requireAdmin = authorizeRole('ADMIN_ROLE');

router.use(validateJWT);

/**
 * @swagger
 * tags:
 *   name: Categoria
 *   description: Gestión de categorías
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Categoria:
 *       type: object
 *       required:
 *         - nombre
 *       properties:
 *         _id:
 *           type: string
 *           description: ID autogenerado
 *         nombre:
 *           type: string
 *           description: Nombre de la categoría
 *         descripcion:
 *           type: string
 *           description: Descripción de la categoría
 *       example:
 *         nombre: "Bebidas"
 *         descripcion: "Categoría de bebidas frías y calientes"
 */

/**
 * @swagger
 * /categoria:
 *   post:
 *     summary: Crear una categoría
 *     tags: [Categoria]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Categoria'
 *     responses:
 *       201:
 *         description: Categoría creada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Categoria'
 *       400:
 *         description: Datos inválidos
 *       500:
 *         description: Error del servidor
 */
router.post('/', requireAdmin, categoriaController.crear);

/**
 * @swagger
 * /categoria:
 *   get:
 *     summary: Obtener todas las categorías
 *     tags: [Categoria]
 *     responses:
 *       200:
 *         description: Lista de categorías
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Categoria'
 *       500:
 *         description: Error del servidor
 */
router.get('/', categoriaController.listar);

/**
 * @swagger
 * /categoria/{id}:
 *   get:
 *     summary: Obtener una categoría por ID
 *     tags: [Categoria]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la categoría
 *     responses:
 *       200:
 *         description: Categoría encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Categoria'
 *       404:
 *         description: Categoría no encontrada
 *       500:
 *         description: Error del servidor
 */
router.get('/:id', categoriaController.obtener);

/**
 * @swagger
 * /categoria/{id}:
 *   put:
 *     summary: Actualizar una categoría
 *     tags: [Categoria]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la categoría
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Categoria'
 *     responses:
 *       200:
 *         description: Categoría actualizada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Categoria'
 *       404:
 *         description: Categoría no encontrada
 *       500:
 *         description: Error del servidor
 */
router.put('/:id', requireAdmin, categoriaController.actualizar);

/**
 * @swagger
 * /categoria/{id}:
 *   delete:
 *     summary: Eliminar una categoría
 *     tags: [Categoria]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la categoría
 *     responses:
 *       200:
 *         description: Categoría eliminada correctamente
 *       404:
 *         description: Categoría no encontrada
 *       500:
 *         description: Error del servidor
 */
router.delete('/:id', requireAdmin, categoriaController.eliminar);

export default router;
