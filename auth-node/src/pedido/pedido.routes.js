import { Router } from "express";
import {
  agregarPedidoCtrl,
  listarPedidosCtrl,
  editarPedidoCtrl,
  eliminarPedidoCtrl
} from "./pedido.controller.js";

import {
  validateCreatePedido,
  validatePedidoId
} from "../../middlewares/pedido-validator.js";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     ProductoPedido:
 *       type: object
 *       required:
 *         - producto
 *         - cantidad
 *       properties:
 *         producto:
 *           type: string
 *           description: ID del producto
 *         cantidad:
 *           type: number
 *           description: Cantidad del producto
 *         precio:
 *           type: number
 *           description: Precio unitario del producto
 *       example:
 *         producto: "664f1b2c9a4e2d001f3a8b12"
 *         cantidad: 2
 *         precio: 45.00
 *
 *     Pedido:
 *       type: object
 *       required:
 *         - cliente
 *         - mesa
 *         - productos
 *       properties:
 *         _id:
 *           type: string
 *           description: ID autogenerado
 *         cliente:
 *           type: string
 *           description: ID del cliente
 *         mesa:
 *           type: string
 *           description: ID de la mesa
 *         productos:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ProductoPedido'
 *           description: Lista de productos del pedido
 *         total:
 *           type: number
 *           description: Total del pedido
 *         estado:
 *           type: string
 *           enum: [pendiente, en_proceso, completado, cancelado]
 *           description: Estado actual del pedido
 *       example:
 *         cliente: "664f1b2c9a4e2d001f3a8b10"
 *         mesa: "664f1b2c9a4e2d001f3a8b11"
 *         productos:
 *           - producto: "664f1b2c9a4e2d001f3a8b12"
 *             cantidad: 2
 *             precio: 45.00
 *         total: 90.00
 *         estado: "pendiente"
 */

/**
 * @swagger
 * /pedido:
 *   post:
 *     summary: Crear un pedido
 *     tags: [Pedido]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Pedido'
 *     responses:
 *       201:
 *         description: Pedido creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pedido'
 *       400:
 *         description: Error de validación
 *       500:
 *         description: Error del servidor
 */
router.post("/", validateCreatePedido, agregarPedidoCtrl);

/**
 * @swagger
 * /pedido:
 *   get:
 *     summary: Obtener todos los pedidos
 *     tags: [Pedido]
 *     responses:
 *       200:
 *         description: Lista de pedidos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pedido'
 *       500:
 *         description: Error del servidor
 */
router.get("/", listarPedidosCtrl);

/**
 * @swagger
 * /pedido/{id}:
 *   put:
 *     summary: Editar un pedido
 *     tags: [Pedido]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del pedido
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Pedido'
 *     responses:
 *       200:
 *         description: Pedido actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pedido'
 *       400:
 *         description: Error de validación
 *       404:
 *         description: Pedido no encontrado
 *       500:
 *         description: Error del servidor
 */
router.put("/:id", validatePedidoId, validateCreatePedido, editarPedidoCtrl);

/**
 * @swagger
 * /pedido/{id}:
 *   delete:
 *     summary: Eliminar un pedido
 *     tags: [Pedido]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del pedido
 *     responses:
 *       200:
 *         description: Pedido eliminado correctamente
 *       404:
 *         description: Pedido no encontrado
 *       500:
 *         description: Error del servidor
 */
router.delete("/:id", validatePedidoId, eliminarPedidoCtrl);

export default router;