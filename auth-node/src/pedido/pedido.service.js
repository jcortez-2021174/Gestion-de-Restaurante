import Pedido from './pedido.model.js';
import Producto from '../producto/producto.model.js';
import Mesas from '../mesas/mesas.model.js';
import { acreditarPedidoEntregado } from '../puntos/puntos.service.js';
import { encolarPedido } from '../notificaciones/notificacion.service.js';

const roundMoney = (value) => Math.round((value + Number.EPSILON) * 100) / 100;

export class PedidoError extends Error {
  constructor(code, message, status = 400) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

export const consolidateRequestedProducts = (productos) => {
  const quantities = new Map();

  for (const item of productos) {
    const productoId = item.productoId.toString();
    quantities.set(productoId, (quantities.get(productoId) || 0) + item.cantidad);
  }

  return [...quantities.entries()].map(([productoId, cantidad]) => ({
    productoId,
    cantidad,
  }));
};

export const buildPriceSnapshots = (requestedProducts, availableProducts) => {
  const productById = new Map(
    availableProducts.map((product) => [product._id.toString(), product])
  );

  return requestedProducts.map(({ productoId, cantidad }) => {
    const product = productById.get(productoId);
    if (!product) {
      throw new PedidoError(
        'PRODUCT_NOT_AVAILABLE',
        `El producto ${productoId} no existe o no esta disponible`,
        409
      );
    }

    return {
      IdProducto: product._id,
      NombreProducto: product.nombre,
      Cantidad: cantidad,
      PrecioUnitario: roundMoney(product.precio),
    };
  });
};

export const calculateOrderTotals = (snapshots) => {
  const subtotal = roundMoney(
    snapshots.reduce(
      (sum, item) => sum + item.PrecioUnitario * item.Cantidad,
      0
    )
  );

  return { subtotal, total: subtotal };
};

export const mapPedidoDto = (pedido) => {
  const cliente = pedido.IdCliente;
  const clienteId = cliente?._id || cliente;
  const mesa = pedido.IdMesa;
  const mesaId = mesa?._id || mesa || null;

  return {
    id: pedido._id.toString(),
    clienteId: clienteId?.toString() || null,
    clienteNombre: cliente?.nombre
      ? `${cliente.nombre} ${cliente.apellido || ''}`.trim()
      : 'Cliente',
    mesaId: mesaId?.toString() || null,
    productos: pedido.Productos.map((item) => ({
      productoId: (item.IdProducto?._id || item.IdProducto).toString(),
      nombre: item.NombreProducto || item.IdProducto?.nombre || 'Producto',
      cantidad: item.Cantidad,
      precioUnitario: item.PrecioUnitario,
      totalLinea: roundMoney(item.PrecioUnitario * item.Cantidad),
    })),
    subtotal: pedido.Subtotal ?? pedido.Total,
    total: pedido.Total,
    estado: pedido.EstadoPedido,
    fechaCreacion: pedido.createdAt || pedido.Fecha,
  };
};

const populatePedido = (query) => query
  .populate('IdCliente', 'nombre apellido correo')
  .populate('IdMesa', 'Numero');

export const crearPedidoService = async ({ clienteId, mesaId, productos }) => {
  const requestedProducts = consolidateRequestedProducts(productos);
  const productIds = requestedProducts.map((item) => item.productoId);

  const availableProducts = await Producto.find({
    _id: { $in: productIds },
    disponibilidad: 'Disponible',
  }).select('nombre precio disponibilidad');

  const snapshots = buildPriceSnapshots(requestedProducts, availableProducts);
  const { subtotal, total } = calculateOrderTotals(snapshots);

  if (mesaId) {
    const mesaExists = await Mesas.exists({ _id: mesaId });
    if (!mesaExists) {
      throw new PedidoError('TABLE_NOT_FOUND', 'La mesa seleccionada no existe', 404);
    }
  }

  const pedido = await Pedido.create({
    IdCliente: clienteId,
    IdMesa: mesaId || null,
    Productos: snapshots,
    Subtotal: subtotal,
    Total: total,
    EstadoPedido: 'Pendiente',
  });

  const populated = await populatePedido(Pedido.findById(pedido._id));
  await encolarPedido({
    pedido: mapPedidoDto(populated),
    cliente: populated.IdCliente,
    estado: 'Creado',
  });
  return mapPedidoDto(populated);
};

export const listarPedidosService = async () => {
  const pedidos = await populatePedido(Pedido.find().sort({ createdAt: -1 }));
  return pedidos.map(mapPedidoDto);
};

export const listarPedidosPorClienteService = async (clienteId) => {
  const pedidos = await populatePedido(
    Pedido.find({ IdCliente: clienteId }).sort({ createdAt: -1 })
  );
  return pedidos.map(mapPedidoDto);
};

export const obtenerPedidoPorIdService = async (id) => {
  const pedido = await populatePedido(Pedido.findById(id));
  if (!pedido) {
    throw new PedidoError('ORDER_NOT_FOUND', 'Pedido no encontrado', 404);
  }
  return mapPedidoDto(pedido);
};

const validStateTransitions = {
  Pendiente: ['EnPreparacion', 'Cancelado'],
  EnPreparacion: ['Listo', 'Cancelado'],
  Listo: ['Entregado', 'Cancelado'],
  Entregado: [],
  Cancelado: [],
};

export const cambiarEstadoPedidoService = async (id, nuevoEstado) => {
  const pedido = await Pedido.findById(id);
  if (!pedido) {
    throw new PedidoError('ORDER_NOT_FOUND', 'Pedido no encontrado', 404);
  }

  const transitions = validStateTransitions[pedido.EstadoPedido] || [];
  if (!transitions.includes(nuevoEstado)) {
    throw new PedidoError(
      'INVALID_ORDER_STATUS_TRANSITION',
      `No se puede cambiar de ${pedido.EstadoPedido} a ${nuevoEstado}`,
      409
    );
  }

  pedido.EstadoPedido = nuevoEstado;
  if (nuevoEstado === 'Entregado') pedido.PuntosAcreditados = true;
  await pedido.save();

  if (nuevoEstado === 'Entregado') {
    try {
      await acreditarPedidoEntregado(pedido);
    } catch (error) {
      pedido.EstadoPedido = 'Listo';
      pedido.PuntosAcreditados = false;
      await pedido.save();
      throw error;
    }
  }

  const populated = await populatePedido(Pedido.findById(pedido._id));
  await encolarPedido({
    pedido: mapPedidoDto(populated),
    cliente: populated.IdCliente,
    estado: nuevoEstado,
  });
  return mapPedidoDto(populated);
};
