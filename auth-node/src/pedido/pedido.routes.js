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

router.post("/", validateCreatePedido, agregarPedidoCtrl);

router.get("/", listarPedidosCtrl);

router.put("/:id", validatePedidoId, validateCreatePedido, editarPedidoCtrl);

router.delete("/:id", validatePedidoId, eliminarPedidoCtrl);

export default router;