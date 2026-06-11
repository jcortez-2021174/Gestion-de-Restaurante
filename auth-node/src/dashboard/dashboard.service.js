import Pedido from "../pedido/pedido.model.js";
import Reservacion from "../reservacion/reservacion.model.js";
import Mesa from "../mesas/mesas.model.js";
import Cliente from "../cliente/cliente.model.js";
import Producto from "../producto/producto.model.js";
import MovimientoPuntos from "../puntos/movimiento-puntos.model.js";

export const getDashboardStats = async () => {
    const now = new Date();
    const startDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startWeek = new Date(startDay);
    startWeek.setDate(startWeek.getDate() - 6);
    const completed = { EstadoPedido: 'Entregado' };

    const [
        pedidosTotales,
        pedidosActivos,
        reservasActivas,
        mesasOcupadas,
        clientesTotales,
        productosDisponibles,
        productosAgotados,
        ventasDia,
        ventasMes,
        pedidosDia,
        ventasSemana,
        pedidosPorEstado,
        ultimosPedidos,
        ultimasReservaciones,
        topProductos,
        puntosOtorgados,
    ] = await Promise.all([
        Pedido.countDocuments(),
        Pedido.countDocuments({ EstadoPedido: { $in: ['Pendiente', 'EnPreparacion', 'Listo'] } }),
        Reservacion.countDocuments({ estadoReservacion: { $in: ['PENDIENTE', 'CONFIRMADA'] } }),
        Mesa.countDocuments({ EstadoMesa: 'OCUPADA' }),
        Cliente.countDocuments({ isActive: true }),
        Producto.countDocuments({ disponibilidad: 'Disponible' }),
        Producto.countDocuments({ disponibilidad: 'NoDisponible' }),
        Pedido.aggregate([{ $match: { ...completed, createdAt: { $gte: startDay } } }, { $group: { _id: null, total: { $sum: '$Total' } } }]),
        Pedido.aggregate([{ $match: { ...completed, createdAt: { $gte: startMonth } } }, { $group: { _id: null, total: { $sum: '$Total' } } }]),
        Pedido.countDocuments({ createdAt: { $gte: startDay } }),
        Pedido.aggregate([
            { $match: { ...completed, createdAt: { $gte: startWeek } } },
            { $group: {
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                total: { $sum: '$Total' },
            } },
            { $sort: { _id: 1 } },
        ]),
        Pedido.aggregate([
            { $group: { _id: '$EstadoPedido', total: { $sum: 1 } } },
            { $sort: { total: -1 } },
        ]),
        Pedido.find().populate('IdCliente', 'nombre apellido').sort({ createdAt: -1 }).limit(5),
        Reservacion.find().populate('idCliente', 'nombre apellido').populate('idMesa', 'Numero').sort({ createdAt: -1 }).limit(5),
        Pedido.aggregate([
            { $unwind: '$Productos' },
            { $group: {
                _id: '$Productos.IdProducto',
                nombre: { $first: '$Productos.NombreProducto' },
                cantidad: { $sum: '$Productos.Cantidad' },
                ingresos: { $sum: { $multiply: ['$Productos.Cantidad', '$Productos.PrecioUnitario'] } },
            } },
            { $sort: { cantidad: -1 } },
            { $limit: 5 },
        ]),
        MovimientoPuntos.aggregate([
            { $match: { createdAt: { $gte: startDay }, puntos: { $gt: 0 } } },
            { $group: { _id: null, total: { $sum: '$puntos' } } },
        ]),
    ]);

    return {
        pedidosTotales,
        pedidosActivos,
        reservasActivas,
        mesasOcupadas,
        clientesTotales,
        productosDisponibles,
        productosAgotados,
        puntosOtorgados: puntosOtorgados[0]?.total || 0,
        ventasDia: ventasDia[0]?.total || 0,
        ventasMes: ventasMes[0]?.total || 0,
        pedidosDia,
        ventasSemana,
        pedidosPorEstado,
        topProductos,
        ultimosPedidos: ultimosPedidos.map((pedido) => ({
            id: pedido._id,
            cliente: pedido.IdCliente
                ? `${pedido.IdCliente.nombre} ${pedido.IdCliente.apellido}`.trim()
                : 'Cliente',
            total: pedido.Total,
            estado: pedido.EstadoPedido,
            fecha: pedido.createdAt,
        })),
        ultimasReservaciones: ultimasReservaciones.map((reserva) => ({
            id: reserva._id,
            cliente: reserva.idCliente
                ? `${reserva.idCliente.nombre} ${reserva.idCliente.apellido}`.trim()
                : 'Cliente',
            mesa: reserva.idMesa?.Numero || null,
            fecha: reserva.fechaReservacion,
            estado: reserva.estadoReservacion,
        })),
    };
};

export const getReportData = async ({ desde, hasta } = {}) => {
    const start = desde ? new Date(`${desde}T00:00:00.000Z`) : new Date(0);
    const end = hasta ? new Date(`${hasta}T23:59:59.999Z`) : new Date();
    const dateMatch = { createdAt: { $gte: start, $lte: end } };

    const [sales, orderStates, reservationStates, products, clients] = await Promise.all([
        Pedido.aggregate([
            { $match: { ...dateMatch, EstadoPedido: 'Entregado' } },
            { $group: {
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                total: { $sum: '$Total' },
                pedidos: { $sum: 1 },
            } },
            { $sort: { _id: 1 } },
        ]),
        Pedido.aggregate([
            { $match: dateMatch },
            { $group: { _id: '$EstadoPedido', total: { $sum: 1 } } },
        ]),
        Reservacion.aggregate([
            { $match: dateMatch },
            { $group: { _id: '$estadoReservacion', total: { $sum: 1 } } },
        ]),
        Pedido.aggregate([
            { $match: dateMatch },
            { $unwind: '$Productos' },
            { $group: {
                _id: '$Productos.IdProducto',
                nombre: { $first: '$Productos.NombreProducto' },
                ventas: { $sum: '$Productos.Cantidad' },
                ingresos: { $sum: { $multiply: ['$Productos.Cantidad', '$Productos.PrecioUnitario'] } },
            } },
            { $sort: { ventas: -1 } },
        ]),
        Pedido.aggregate([
            { $match: dateMatch },
            { $group: {
                _id: '$IdCliente',
                visitas: { $sum: 1 },
                gasto: { $sum: '$Total' },
            } },
            { $sort: { visitas: -1 } },
            { $limit: 10 },
            { $lookup: { from: 'clientes', localField: '_id', foreignField: '_id', as: 'cliente' } },
            { $unwind: '$cliente' },
            { $project: {
                _id: 0,
                id: '$cliente._id',
                nombre: { $concat: ['$cliente.nombre', ' ', '$cliente.apellido'] },
                visitas: 1,
                gasto: 1,
            } },
        ]),
    ]);

    return {
        desde: start,
        hasta: end,
        ventas: sales,
        totalVentas: sales.reduce((sum, item) => sum + item.total, 0),
        pedidos: orderStates,
        reservaciones: reservationStates,
        productosMasVendidos: products.slice(0, 10),
        productosMenosVendidos: [...products].sort((a, b) => a.ventas - b.ventas).slice(0, 10),
        clientesFrecuentes: clients,
    };
};
