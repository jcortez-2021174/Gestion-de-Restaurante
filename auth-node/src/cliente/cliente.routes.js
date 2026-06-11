import { Router } from 'express';

import { body } from 'express-validator';

import { validarId } from '../../middlewares/validar-id.js';
import { validateJWT } from '../../middlewares/validate-jwt.js';
import { authorizeRole } from '../../middlewares/authorize-role.js';

import {

  agregarCliente,
  listarClientesCtrl,
  editarClienteCtrl,
  eliminarClienteCtrl,
  getClientesDashboard

} from './cliente.controller.js';

const router = Router();

router.use(validateJWT, authorizeRole('ADMIN_ROLE'));

/* =========================================
   VALIDACIONES
========================================= */

const validarCliente = [

  body('nombre')
    .notEmpty().withMessage('El nombre es obligatorio')
    .isString().withMessage('El nombre debe ser texto'),

  body('apellido')
    .notEmpty().withMessage('El apellido es obligatorio')
    .isString().withMessage('El apellido debe ser texto'),

  body('telefono')
    .notEmpty().withMessage('El teléfono es obligatorio')
    .isLength({ min: 8 })
    .withMessage('El teléfono debe tener 8 dígitos'),

  body('correo')
    .notEmpty().withMessage('El correo es obligatorio')
    .isEmail().withMessage('Debe ser un correo electrónico válido'),

  body('direccion')
    .notEmpty().withMessage('La dirección es obligatoria')

];

/**
 * @swagger
 * components:
 *   schemas:
 *     Cliente:
 *       type: object
 *       required:
 *         - nombre
 *         - apellido
 *         - telefono
 *         - correo
 *         - direccion
 *       properties:
 *         _id:
 *           type: string
 *           description: ID autogenerado
 *         nombre:
 *           type: string
 *           description: Nombre del cliente
 *         apellido:
 *           type: string
 *           description: Apellido del cliente
 *         telefono:
 *           type: string
 *           description: Teléfono del cliente
 *         correo:
 *           type: string
 *           format: email
 *           description: Correo electrónico
 *         direccion:
 *           type: string
 *           description: Dirección del cliente
 *       example:
 *         nombre: "Juan"
 *         apellido: "Pérez"
 *         telefono: "55551234"
 *         correo: "juan@correo.com"
 *         direccion: "Zona 10, Guatemala"
 */

/* =========================================
   DASHBOARD CLIENTES
========================================= */

/**
 * @swagger
 * /cliente/dashboard:
 *   get:
 *     summary: Obtener dashboard dinámico de clientes
 *     tags: [Cliente]
 *     responses:
 *       200:
 *         description: Dashboard generado correctamente
 *       500:
 *         description: Error del servidor
 */

router.get(
  '/dashboard',
  getClientesDashboard
);

/* =========================================
   CREAR CLIENTE
========================================= */

/**
 * @swagger
 * /cliente:
 *   post:
 *     summary: Crear un cliente
 *     tags: [Cliente]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cliente'
 *     responses:
 *       201:
 *         description: Cliente creado correctamente
 *       400:
 *         description: Error de validación
 *       500:
 *         description: Error del servidor
 */

router.post(
  '/',
  validarCliente,
  agregarCliente
);

/* =========================================
   LISTAR CLIENTES
========================================= */

/**
 * @swagger
 * /cliente:
 *   get:
 *     summary: Obtener todos los clientes
 *     tags: [Cliente]
 *     responses:
 *       200:
 *         description: Lista de clientes
 *       500:
 *         description: Error del servidor
 */

router.get(
  '/',
  listarClientesCtrl
);

/* =========================================
   EDITAR CLIENTE
========================================= */

/**
 * @swagger
 * /cliente/{id}:
 *   put:
 *     summary: Editar cliente
 *     tags: [Cliente]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del cliente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cliente'
 *     responses:
 *       200:
 *         description: Cliente actualizado correctamente
 *       400:
 *         description: Error de validación
 *       404:
 *         description: Cliente no encontrado
 *       500:
 *         description: Error del servidor
 */

router.put(
  '/:id',
  validarId,
  validarCliente,
  editarClienteCtrl
);

/* =========================================
   ELIMINAR CLIENTE
========================================= */

/**
 * @swagger
 * /cliente/{id}:
 *   delete:
 *     summary: Eliminar cliente
 *     tags: [Cliente]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del cliente
 *     responses:
 *       200:
 *         description: Cliente eliminado correctamente
 *       404:
 *         description: Cliente no encontrado
 *       500:
 *         description: Error del servidor
 */

router.delete(
  '/:id',
  validarId,
  eliminarClienteCtrl
);

export default router;
