import Pedido from "./pedido.model.js";

export const crearPedidoService = async (data) => {
  const pedido = new Pedido(data);
  return await pedido.save();
};

export const listarPedidosService = async () => {
  return await Pedido.find()
    .populate("IdCliente")
    .populate("IdMesa")
    .populate("Productos.IdProducto");
};

// NUEVO: Obtener el historial o pedidos activos de un cliente específico
export const listarPedidosPorClienteService = async (clienteId) => {
  return await Pedido.find({ IdCliente: clienteId })
    .populate("IdMesa")
    .populate("Productos.IdProducto")
    .sort({ createdAt: -1 }); // El más reciente primero
};

export const editarPedidoService = async (id, data) => {
  return await Pedido.findByIdAndUpdate(id, data, { new: true });
};

export const eliminarPedidoService = async (id) => {
  return await Pedido.findByIdAndDelete(id);
};

// Valid state transitions for orders
const validStateTransitions = {
  "Pendiente": ["EnPreparacion", "Cancelado"],
  "EnPreparacion": ["Listo", "Cancelado"],
  "Listo": ["Entregado"],
  "Entregado": [],
  "Cancelado": []
};

export const cambiarEstadoPedidoService = async (id, nuevoEstado) => {
  const pedido = await Pedido.findById(id);
  if (!pedido) {
    throw new Error("Pedido no encontrado");
  }

  const estadoActual = pedido.EstadoPedido;
  const transicionesValidas = validStateTransitions[estadoActual] || [];

  if (!transicionesValidas.includes(nuevoEstado)) {
    throw new Error(`No se puede cambiar de "${estadoActual}" a "${nuevoEstado}". Transiciones válidas: ${transicionesValidas.join(", ")}`);
  }

  pedido.EstadoPedido = nuevoEstado;
  return await pedido.save();
};

export const cancelarPedidoService = async (id, razon = "") => {
  const pedido = await Pedido.findById(id);
  if (!pedido) {
    throw new Error("Pedido no encontrado");
  }

  if (pedido.EstadoPedido === "Cancelado") {
    throw new Error("El pedido ya está cancelado");
  }

  if (pedido.EstadoPedido === "Entregado") {
    throw new Error("No se puede cancelar un pedido ya entregado");
  }

  pedido.EstadoPedido = "Cancelado";
  if (razon) {
    pedido.RazonCancelacion = razon;
  }
  return await pedido.save();
};