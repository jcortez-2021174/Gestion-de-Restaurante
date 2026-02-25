import express from "express";
import { crearMesa, editarMesa, eliminarMesa, listarMesas, obtenerMesa } from "./mesas.controller.js";

const router = express.Router();

router.post("/", crearMesa);

router.put("/:id", editarMesa);

router.delete("/:id", eliminarMesa);

router.get("/", listarMesas);

router.get("/:id", obtenerMesa);

export default router;