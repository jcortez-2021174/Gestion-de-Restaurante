import { validationResult } from 'express-validator';
import { 
    crearReservacionRecord, 
    listarReservacionesRecord, 
    actualizarReservacionRecord 
} from './reservacion.service.js';

// 1. Agregar Reservación
export const agregarReservacion = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
        const nuevaReservacion = await crearReservacionRecord(req.body);
        return res.status(201).json({
            success: true,
            message: 'Reservación registrada correctamente',
            data: nuevaReservacion
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// 2. Listar Reservaciones
export const listarReservacionesCtrl = async (req, res) => {
    try {
        const reservaciones = await listarReservacionesRecord();
        return res.status(200).json({
            success: true,
            total: reservaciones.length,
            data: reservaciones
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// 3. Editar Reservación (Con bloqueo de llaves foráneas)
export const editarReservacion = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        // Validación de seguridad sugerida: No permitir editar Clientes ni Mesas
        if (data.idCliente || data.idMesa) {
            return res.status(400).json({
                success: false,
                message: 'No está permitido modificar el Cliente o la Mesa de una reservación existente.'
            });
        }

        const reservacionActualizada = await actualizarReservacionRecord(id, data);
        if (!reservacionActualizada) return res.status(404).json({ success: false, message: 'Reservación no encontrada' });

        return res.status(200).json({ success: true, data: reservacionActualizada });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// 4. Eliminar Reservación (Soft Delete)
export const eliminarReservacion = async (req, res) => {
    try {
        const { id } = req.params;
        
        const softDelete = await actualizarReservacionRecord(id, { 
            isActive: false, 
            estadoReservacion: 'CANCELADA' 
        });

        if (!softDelete) {
            return res.status(404).json({ 
                success: false, 
                message: 'No se encontró la reservación' 
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Reservación desactivada correctamente (Soft Delete aplicado)',
            data: { id: softDelete._id, activo: softDelete.isActive }
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};