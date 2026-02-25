import Mesa from "./mesas.model.js";

export const crearMesa = async (data) => {
  const mesa = new Mesa(data);
  return await mesa.save();
};

export const editarMesa = async (id, data) => {
  const mesa = await Mesa.findById(id);
  if (!mesa) throw new Error("Mesa no encontrada");
  Object.assign(mesa, data);
  return await mesa.save();
};

export const eliminarMesa = async (id) => {
  const mesa = await Mesa.findById(id);
  if (!mesa) throw new Error("Mesa no encontrada");
  return await mesa.deleteOne();
};

export const listarMesas = async () => {
  return await Mesa.find();
};

export const obtenerMesa = async (id) => {
  const mesa = await Mesa.findById(id);
  if (!mesa) throw new Error("Mesa no encontrada");
  return mesa;
};