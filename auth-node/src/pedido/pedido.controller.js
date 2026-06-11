import {
  PedidoError,
  cambiarEstadoPedidoService,
  crearPedidoService,
  listarPedidosPorClienteService,
  listarPedidosService,
  obtenerPedidoPorIdService,
} from './pedido.service.js';

const sendError = (res, error, fallbackMessage) => {
  if (error instanceof PedidoError) {
    return res.status(error.status).json({
      success: false,
      code: error.code,
      message: error.message,
    });
  }

  console.error(fallbackMessage, error);
  return res.status(500).json({
    success: false,
    code: 'ORDER_INTERNAL_ERROR',
    message: fallbackMessage,
  });
};

export const agregarPedidoCtrl = async (req, res) => {
  try {
    const pedido = await crearPedidoService({
      clienteId: req.cliente._id,
      mesaId: req.body.mesaId ?? null,
      productos: req.body.productos,
    });

    return res.status(201).json({ success: true, data: pedido });
  } catch (error) {
    return sendError(res, error, 'No se pudo crear el pedido');
  }
};

export const listarPedidosCtrl = async (req, res) => {
  try {
    const pedidos = await listarPedidosService();
    return res.status(200).json({ success: true, data: pedidos });
  } catch (error) {
    return sendError(res, error, 'No se pudieron listar los pedidos');
  }
};

export const obtenerMisPedidosCtrl = async (req, res) => {
  try {
    const pedidos = await listarPedidosPorClienteService(req.cliente._id);
    return res.status(200).json({ success: true, data: pedidos });
  } catch (error) {
    return sendError(res, error, 'No se pudo obtener el historial de pedidos');
  }
};

export const obtenerPedidoPorIdCtrl = async (req, res) => {
  try {
    const pedido = await obtenerPedidoPorIdService(req.params.id);
    return res.status(200).json({ success: true, data: pedido });
  } catch (error) {
    return sendError(res, error, 'No se pudo obtener el pedido');
  }
};

export const cambiarEstadoPedidoCtrl = async (req, res) => {
  try {
    const pedido = await cambiarEstadoPedidoService(req.params.id, req.body.estado);
    return res.status(200).json({ success: true, data: pedido });
  } catch (error) {
    return sendError(res, error, 'No se pudo actualizar el estado del pedido');
  }
};
