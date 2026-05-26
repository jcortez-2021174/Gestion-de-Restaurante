import { body, param } from "express-validator";
import { checkValidators } from "./check-validators.js";
import { validateJWT } from "./validate-jwt.js";

const estadosPedido = ["Pendiente", "EnPreparacion", "Listo", "Entregado", "Cancelado"];

export const validateCreatePedido = [
  validateJWT,

  body("Total")
    .notEmpty().withMessage("Total requerido")
    .isNumeric().withMessage("Total debe ser número"),

  body("TipoPedido")
    .notEmpty().withMessage("Tipo de pedido requerido")
    .isIn(["Restaurante", "Domicilio"]).withMessage("Tipo de pedido no válido"),

  body("MetodoPago")
    .notEmpty().withMessage("Método de pago requerido")
    .isIn(["Efectivo", "Tarjeta"]).withMessage("Método de pago no válido"),

  body("Productos")
    .isArray({ min: 1 }).withMessage("El pedido debe contener al menos un producto"),

  body("Productos.*.IdProducto")
    .notEmpty().isMongoId().withMessage("Id del producto no válido"),

  body("Productos.*.Cantidad")
    .isInt({ min: 1 }).withMessage("La cantidad debe ser un entero mayor a 0"),

  body("Productos.*.PrecioUnitario")
    .isNumeric().withMessage("Precio unitario debe ser numérico"),

  body("EstadoPedido")
    .optional()
    .isIn(estadosPedido)
    .withMessage("EstadoPedido no válido"),

  body("IdCliente")
    .notEmpty().withMessage("IdCliente requerido")
    .isMongoId().withMessage("IdCliente no válido"),

  body("IdMesa")
    .optional()
    .custom((value, { req }) => {
      if (req.body.TipoPedido === "Restaurante" && !value) {
        throw new Error("El IdMesa es requerido si el tipo de pedido es Restaurante");
      }
      return true;
    }),

  checkValidators,
];

export const validatePedidoId = [
  validateJWT,
  param("id").isMongoId().withMessage("Id pedido no válido"),
  checkValidators,
];