import * as mesasService from "./mesas.service.js";

export const crearMesa = async (req, res) => {
  try {
    const mesa = await mesasService.crearMesa(req.body);
    res.status(201).json(mesa);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const editarMesa = async (req, res) => {
  try {
    const mesa = await mesasService.editarMesa(req.params.id, req.body);
    res.json(mesa);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const eliminarMesa = async (req, res) => {
  try {
    await mesasService.eliminarMesa(req.params.id);
    res.json({ message: "Mesa eliminada correctamente" });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const listarMesas = async (req, res) => {
  try {
    const mesas = await mesasService.listarMesas();
    res.json(mesas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const obtenerMesa = async (req, res) => {
  try {
    const mesa = await mesasService.obtenerMesa(req.params.id);
    res.json(mesa);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};