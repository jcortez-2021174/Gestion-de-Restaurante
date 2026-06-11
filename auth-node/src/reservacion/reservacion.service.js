import  Reservacion  from './reservacion.model.js';


export const crearReservacion = async (data) => {
    const reservacion = new Reservacion(data);
    return await reservacion.save();
};


export const listarReservaciones = async () => {
    return await Reservacion.find({ isActive: true })
        .populate('idCliente', 'nombre apellido correo')
        .populate('idMesa', 'numero capacidad')
        .sort({ fechaReservacion: 1 });
};

export const obtenerReservacionPorId = async (id) => {
    return await Reservacion.findById(id)
        .populate('idCliente', 'nombre apellido correo')
        .populate('idMesa', 'numero capacidad');
};

export const listarReservacionesPorCliente = async (clienteId) => {
    return await Reservacion.find({ idCliente: clienteId, isActive: true })
        .populate('idMesa', 'numero capacidad')
        .sort({ fechaReservacion: 1 });
};

export const listarReservacionesPorMesa = async (mesaId, fecha = null) => {
    const query = { idMesa: mesaId, isActive: true };
    if (fecha) {
        query.fechaReservacion = new Date(fecha);
    }
    return await Reservacion.find(query)
        .populate('idCliente', 'nombre apellido correo')
        .sort({ fechaReservacion: 1 });
};

export const actualizarReservacion = async (id, data) => {
    return await Reservacion.findByIdAndUpdate(
        id,
        data,
        { new: true, runValidators: true }
    ).populate('idCliente', 'nombre apellido correo')
     .populate('idMesa', 'numero capacidad');
};

// Valid state transitions for reservations
const validStateTransitions = {
    "RESERVADA": ["CANCELADA", "EXPIRADA"],
    "CANCELADA": [],
    "EXPIRADA": []
};

export const cambiarEstadoReservacion = async (id, nuevoEstado) => {
    const reservacion = await Reservacion.findById(id);
    if (!reservacion) {
        throw new Error("Reservación no encontrada");
    }

    const estadoActual = reservacion.estadoReservacion;
    const transicionesValidas = validStateTransitions[estadoActual] || [];

    if (!transicionesValidas.includes(nuevoEstado)) {
        throw new Error(`No se puede cambiar de "${estadoActual}" a "${nuevoEstado}". Transiciones válidas: ${transicionesValidas.join(", ")}`);
    }

    reservacion.estadoReservacion = nuevoEstado;
    return await reservacion.save();
};

export const eliminarReservacion = async (id) => {
    return await Reservacion.findByIdAndDelete(id);
};

export const cancelarReservacion = async (id, razon = "") => {
    const reservacion = await Reservacion.findById(id);
    if (!reservacion) {
        throw new Error("Reservación no encontrada");
    }

    if (reservacion.estadoReservacion === "CANCELADA") {
        throw new Error("La reservación ya está cancelada");
    }

    if (reservacion.estadoReservacion === "EXPIRADA") {
        throw new Error("No se puede cancelar una reservación expirada");
    }

    reservacion.estadoReservacion = "CANCELADA";
    if (razon) {
        reservacion.RazonCancelacion = razon;
    }
    return await reservacion.save();
};