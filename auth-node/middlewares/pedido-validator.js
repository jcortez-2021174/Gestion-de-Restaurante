import { body, param } from "express-validator";
import { checkValidators } from "./check-validators.js";
import { validateJWT } from "./validate-jwt.js";

const estadosPedido = [
  "Pendiente",
  "EnPreparacion",
  "Listo",
  "Entregado",
  "Cancelado"
];

export const validateCreatePedido = [
  validateJWT,

  body("Total")
    .notEmpty().withMessage("Total requerido")
    .isNumeric().withMessage("Total debe ser número"),

  body("EstadoPedido")
    .optional()
    .isIn(estadosPedido)
    .withMessage("EstadoPedido no válido"),

  body("IdCliente")
    .notEmpty().withMessage("IdCliente requerido")
    .isMongoId().withMessage("IdCliente no válido"),

  body("IdMesa")
    .notEmpty().withMessage("IdMesa requerido")
    .isMongoId().withMessage("IdMesa no válido"),

  checkValidators,
];

export const validatePedidoId = [
  validateJWT,

  param("id")
    .isMongoId()
    .withMessage("Id pedido no válido"),

  checkValidators,
];