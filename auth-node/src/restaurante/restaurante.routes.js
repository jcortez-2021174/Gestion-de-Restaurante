import { Router } from 'express';
import { createRestaurante, getRestaurantes, getConfiguracion, updateConfiguracion } from './restaurante.controller.js';
import { validateCreateRestaurante } from '../../middlewares/restaurante-validator.js';
import { validateJWT } from '../../middlewares/validate-jwt.js';
import { authorizeRole } from '../../middlewares/authorize-role.js';

const router = Router();

router.use(validateJWT, authorizeRole('ADMIN_ROLE'));
router.get('/configuracion', getConfiguracion);
router.put('/configuracion', updateConfiguracion);

/**
 * @swagger
 * components:
 *   schemas:
 *     Restaurante:
 *       type: object
 *       required:
 *         - nombre
 *         - direccion
 *       properties:
 *         _id:
 *           type: string
 *           description: ID autogenerado
 *         nombre:
 *           type: string
 *           description: Nombre del restaurante
 *         direccion:
 *           type: string
 *           description: Dirección del restaurante
 *         telefono:
 *           type: string
 *           description: Teléfono del restaurante
 *         correo:
 *           type: string
 *           format: email
 *           description: Correo electrónico del restaurante
 *         estado:
 *           type: string
 *           enum: [activo, inactivo]
 *           default: activo
 *           description: Estado del restaurante
 *       example:
 *         nombre: "Áurea Restaurant"
 *         direccion: "Zona 10, Ciudad de Guatemala"
 *         telefono: "23456789"
 *         correo: "aurea@restaurante.com"
 *         estado: "activo"
 */

/**
 * @swagger
 * /restaurante:
 *   post:
 *     summary: Crear un restaurante
 *     tags: [Restaurante]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Restaurante'
 *     responses:
 *       201:
 *         description: Restaurante creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Restaurante'
 *       400:
 *         description: Error de validación
 *       500:
 *         description: Error del servidor
 */
router.post('/', validateCreateRestaurante, createRestaurante);

/**
 * @swagger
 * /restaurante:
 *   get:
 *     summary: Obtener todos los restaurantes
 *     tags: [Restaurante]
 *     responses:
 *       200:
 *         description: Lista de restaurantes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Restaurante'
 *       500:
 *         description: Error del servidor
 */
router.get('/', getRestaurantes);

export default router;
