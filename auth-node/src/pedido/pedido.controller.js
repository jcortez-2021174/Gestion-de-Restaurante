import {
  crearPedidoService,
  listarPedidosService,
  editarPedidoService,
  eliminarPedidoService,
  listarPedidosPorClienteService,
  cambiarEstadoPedidoService,
  cancelarPedidoService
} from "./pedido.service.js";

export const agregarPedidoCtrl = async (req, res) => {
  try {
    const pedido = await crearPedidoService(req.body);
    res.status(201).json(pedido);
  } catch (error) {
    res.status(500).json({ msg: "Error al crear pedido", error: error.message });
  }
};

export const listarPedidosCtrl = async (req, res) => {
  try {
    const pedidos = await listarPedidosService();
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ msg: "Error al listar pedidos" });
  }
};

// NUEVO: Obtener tracking en tiempo real del usuario autenticado
export const obtenerPedidosClienteCtrl = async (req, res) => {
  try {
    // Asumiendo que validateJWT inyecta el usuario o el ID en req.user o req.uid
    const clienteId = req.params.clienteId;
    const pedidos = await listarPedidosPorClienteService(clienteId);
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener seguimiento del pedido" });
  }
};

export const editarPedidoCtrl = async (req, res) => {
  try {
    const pedido = await editarPedidoService(req.params.id, req.body);
    res.json(pedido);
  } catch (error) {
    res.status(500).json({ msg: "Error al editar pedido" });
  }
};

export const eliminarPedidoCtrl = async (req, res) => {
  try {
    await eliminarPedidoService(req.params.id);
    res.json({ msg: "Pedido eliminado" });
  } catch (error) {
    res.status(500).json({ msg: "Error al eliminar pedido" });
  }
};

export const cambiarEstadoPedidoCtrl = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    if (!estado) {
      return res.status(400).json({ msg: "El campo 'estado' es requerido" });
    }

    const pedido = await cambiarEstadoPedidoService(id, estado);
    res.json(pedido);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const cancelarPedidoCtrl = async (req, res) => {
  try {
    const { id } = req.params;
    const { razon } = req.body;

    const pedido = await cancelarPedidoService(id, razon);
    res.json(pedido);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};