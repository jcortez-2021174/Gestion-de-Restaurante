import { Router } from 'express';
import { body } from 'express-validator';
import { 
    agregarReservacion, 
    listarReservacionesCtrl, 
    editarReservacion, 
    eliminarReservacion 
} from './reservacion.controller.js';

const router = Router();


const validarReservacion = [
    body('fechaReservacion')
        .notEmpty().withMessage('La fecha de reservación es obligatoria')
        .isISO8601().withMessage('Debe ser una fecha válida (YYYY-MM-DD)'),
    body('cantidadPersonas')
        .notEmpty().withMessage('La cantidad de personas es obligatoria')
        .isInt({ min: 1 }).withMessage('Debe ser al menos 1 persona'),
    body('idCliente')
        .notEmpty().withMessage('El ID del cliente es obligatorio')
        .isMongoId().withMessage('El ID del cliente no es válido'),
    body('idMesa')
        .notEmpty().withMessage('El ID de la mesa es obligatorio')
        .isMongoId().withMessage('El ID de la mesa no es válido'),
];


router.post('/', validarReservacion, agregarReservacion);


router.get('/', listarReservacionesCtrl);


router.put('/:id', editarReservacion);


router.delete('/:id', eliminarReservacion);

export default router;