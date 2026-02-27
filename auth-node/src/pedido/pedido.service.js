import Pedido from "./pedido.model.js";

export const crearPedidoService = async (data) => {
  const pedido = new Pedido(data);
  return await pedido.save();
};

export const listarPedidosService = async () => {
  return await Pedido.find()
    .populate("IdCliente")
    .populate("IdMesa");
};

export const editarPedidoService = async (id, data) => {
  return await Pedido.findByIdAndUpdate(id, data, { new: true });
};

export const eliminarPedidoService = async (id) => {
  return await Pedido.findByIdAndDelete(id);
};