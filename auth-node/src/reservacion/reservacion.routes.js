import { Router } from 'express';
import { body } from 'express-validator';
import { 
    agregarReservacion, 
    listarReservacionesCtrl, 
    editarReservacion, 
    eliminarReservacion 
} from './reservacion.controller.js';

const router = Router();

const validarReservacion = [
    body('fechaReservacion')
        .notEmpty().withMessage('La fecha de reservación es obligatoria')
        .isISO8601().withMessage('Debe ser una fecha válida (YYYY-MM-DD)'),
    body('cantidadPersonas')
        .notEmpty().withMessage('La cantidad de personas es obligatoria')
        .isInt({ min: 1 }).withMessage('Debe ser al menos 1 persona'),
    body('idCliente')
        .notEmpty().withMessage('El ID del cliente es obligatorio')
        .isMongoId().withMessage('El ID del cliente no es válido'),
    body('idMesa')
        .notEmpty().withMessage('El ID de la mesa es obligatorio')
        .isMongoId().withMessage('El ID de la mesa no es válido'),
];

/**
 * @swagger
 * components:
 *   schemas:
 *     Reservacion:
 *       type: object
 *       required:
 *         - fechaReservacion
 *         - cantidadPersonas
 *         - idCliente
 *         - idMesa
 *       properties:
 *         _id:
 *           type: string
 *           description: ID autogenerado
 *         fechaReservacion:
 *           type: string
 *           format: date
 *           description: Fecha de la reservación (YYYY-MM-DD)
 *         cantidadPersonas:
 *           type: integer
 *           minimum: 1
 *           description: Cantidad de personas para la reservación
 *         idCliente:
 *           type: string
 *           description: ID del cliente que hace la reservación
 *         idMesa:
 *           type: string
 *           description: ID de la mesa reservada
 *         estado:
 *           type: string
 *           enum: [pendiente, confirmada, cancelada]
 *           default: pendiente
 *           description: Estado actual de la reservación
 *       example:
 *         fechaReservacion: "2025-12-25"
 *         cantidadPersonas: 4
 *         idCliente: "664f1b2c9a4e2d001f3a8b10"
 *         idMesa: "664f1b2c9a4e2d001f3a8b11"
 *         estado: "pendiente"
 */

/**
 * @swagger
 * /reservacion:
 *   post:
 *     summary: Crear una reservación
 *     tags: [Reservacion]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Reservacion'
 *     responses:
 *       201:
 *         description: Reservación creada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservacion'
 *       400:
 *         description: Error de validación
 *       500:
 *         description: Error del servidor
 */
router.post('/', validarReservacion, agregarReservacion);

/**
 * @swagger
 * /reservacion:
 *   get:
 *     summary: Obtener todas las reservaciones
 *     tags: [Reservacion]
 *     responses:
 *       200:
 *         description: Lista de reservaciones
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reservacion'
 *       500:
 *         description: Error del servidor
 */
router.get('/', listarReservacionesCtrl);

/**
 * @swagger
 * /reservacion/{id}:
 *   put:
 *     summary: Editar una reservación
 *     tags: [Reservacion]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la reservación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Reservacion'
 *     responses:
 *       200:
 *         description: Reservación actualizada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservacion'
 *       400:
 *         description: Error de validación
 *       404:
 *         description: Reservación no encontrada
 *       500:
 *         description: Error del servidor
 */
router.put('/:id', editarReservacion);

/**
 * @swagger
 * /reservacion/{id}:
 *   delete:
 *     summary: Eliminar una reservación
 *     tags: [Reservacion]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la reservación
 *     responses:
 *       200:
 *         description: Reservación eliminada correctamente
 *       404:
 *         description: Reservación no encontrada
 *       500:
 *         description: Error del servidor
 */
router.delete('/:id', eliminarReservacion);

export default router;