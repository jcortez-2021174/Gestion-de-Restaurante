import express from "express";
import { crearMesa, editarMesa, eliminarMesa, listarMesas, obtenerMesa } from "./mesas.controller.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Mesa:
 *       type: object
 *       required:
 *         - numero
 *         - capacidad
 *       properties:
 *         _id:
 *           type: string
 *           description: ID autogenerado
 *         numero:
 *           type: number
 *           description: Número de la mesa
 *         capacidad:
 *           type: number
 *           description: Capacidad de personas en la mesa
 *         estado:
 *           type: string
 *           enum: [disponible, ocupada, reservada]
 *           description: Estado actual de la mesa
 *       example:
 *         numero: 5
 *         capacidad: 4
 *         estado: "disponible"
 */

/**
 * @swagger
 * /mesa:
 *   post:
 *     summary: Crear una mesa
 *     tags: [Mesa]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Mesa'
 *     responses:
 *       201:
 *         description: Mesa creada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Mesa'
 *       400:
 *         description: Datos inválidos
 *       500:
 *         description: Error del servidor
 */
router.post("/", crearMesa);

/**
 * @swagger
 * /mesa/{id}:
 *   put:
 *     summary: Editar una mesa
 *     tags: [Mesa]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la mesa
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Mesa'
 *     responses:
 *       200:
 *         description: Mesa actualizada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Mesa'
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Mesa no encontrada
 *       500:
 *         description: Error del servidor
 */
router.put("/:id", editarMesa);

/**
 * @swagger
 * /mesa/{id}:
 *   delete:
 *     summary: Eliminar una mesa
 *     tags: [Mesa]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la mesa
 *     responses:
 *       200:
 *         description: Mesa eliminada correctamente
 *       404:
 *         description: Mesa no encontrada
 *       500:
 *         description: Error del servidor
 */
router.delete("/:id", eliminarMesa);

/**
 * @swagger
 * /mesa:
 *   get:
 *     summary: Obtener todas las mesas
 *     tags: [Mesa]
 *     responses:
 *       200:
 *         description: Lista de mesas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Mesa'
 *       500:
 *         description: Error del servidor
 */
router.get("/", listarMesas);

/**
 * @swagger
 * /mesa/{id}:
 *   get:
 *     summary: Obtener una mesa por ID
 *     tags: [Mesa]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la mesa
 *     responses:
 *       200:
 *         description: Mesa encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Mesa'
 *       404:
 *         description: Mesa no encontrada
 *       500:
 *         description: Error del servidor
 */
router.get("/:id", obtenerMesa);

export default router;