import { Router } from 'express';
import { body } from 'express-validator';
import {
    agregarReservacion,
    listarReservacionesCtrl,
    editarReservacion,
    eliminarReservacionCtrl,
    obtenerReservacionPorIdCtrl,
    listarReservacionesPorClienteCtrl,
    listarReservacionesPorMesaCtrl,
    cambiarEstadoReservacionCtrl,
    cancelarReservacionCtrl
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
 *   get:
 *     summary: Obtener una reservación por ID
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
 *         description: Reservación encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservacion'
 *       404:
 *         description: Reservación no encontrada
 *       500:
 *         description: Error del servidor
 */
router.get('/:id', obtenerReservacionPorIdCtrl);

/**
 * @swagger
 * /reservacion/cliente/{clienteId}:
 *   get:
 *     summary: Obtener reservaciones de un cliente
 *     tags: [Reservacion]
 *     parameters:
 *       - in: path
 *         name: clienteId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del cliente
 *     responses:
 *       200:
 *         description: Lista de reservaciones del cliente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reservacion'
 *       500:
 *         description: Error del servidor
 */
router.get('/cliente/:clienteId', listarReservacionesPorClienteCtrl);

/**
 * @swagger
 * /reservacion/mesa/{mesaId}:
 *   get:
 *     summary: Obtener reservaciones de una mesa
 *     tags: [Reservacion]
 *     parameters:
 *       - in: path
 *         name: mesaId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la mesa
 *       - in: query
 *         name: fecha
 *         required: false
 *         schema:
 *           type: string
 *         description: Fecha para filtrar (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Lista de reservaciones de la mesa
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reservacion'
 *       500:
 *         description: Error del servidor
 */
router.get('/mesa/:mesaId', listarReservacionesPorMesaCtrl);

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
router.delete('/:id', eliminarReservacionCtrl);

/**
 * @swagger
 * /reservacion/{id}/estado:
 *   patch:
 *     summary: Cambiar estado de una reservación
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
 *             type: object
 *             required:
 *               - estado
 *             properties:
 *               estado:
 *                 type: string
 *                 enum: [RESERVADA, CANCELADA, EXPIRADA]
 *                 description: Nuevo estado de la reservación
 *     responses:
 *       200:
 *         description: Estado de la reservación actualizado
 *       400:
 *         description: Error de validación o transición inválida
 *       404:
 *         description: Reservación no encontrada
 *       500:
 *         description: Error del servidor
 */
router.patch('/:id/estado', cambiarEstadoReservacionCtrl);

/**
 * @swagger
 * /reservacion/{id}/cancelar:
 *   patch:
 *     summary: Cancelar una reservación
 *     tags: [Reservacion]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la reservación
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               razon:
 *                 type: string
 *                 description: Razón de la cancelación
 *     responses:
 *       200:
 *         description: Reservación cancelada
 *       400:
 *         description: Error de validación
 *       404:
 *         description: Reservación no encontrada
 *       500:
 *         description: Error del servidor
 */
router.patch('/:id/cancelar', cancelarReservacionCtrl);

export default router;