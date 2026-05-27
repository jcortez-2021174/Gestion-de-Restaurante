import Pedido from "../pedido/pedido.model.js";
import Reservacion from "../reservacion/reservacion.model.js";
import Mesa from "../mesas/mesas.model.js";
import Cliente from "../cliente/cliente.model.js";

export const getDashboardStats = async () => {

    const pedidosTotales = await Pedido.countDocuments();

    const reservasTotales = await Reservacion.countDocuments();

    const mesasOcupadas = await Mesa.countDocuments({
        estado: "Ocupada"
    });

    const clientesTotales = await Cliente.countDocuments();

    return {
        pedidosTotales,
        reservasTotales,
        mesasOcupadas,
        clientesTotales
    };
};