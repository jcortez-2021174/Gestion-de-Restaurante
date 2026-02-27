import { Router } from 'express';
import { body } from 'express-validator';
import { validarId } from '../../middlewares/validar-id.js';
import { agregarCliente, listarClientesCtrl, editarClienteCtrl, eliminarClienteCtrl } from './cliente.controller.js';

const router = Router();


const validarCliente = [
  body('nombre')
    .notEmpty().withMessage('El nombre es obligatorio')
    .isString().withMessage('El nombre debe ser texto'),
  body('apellido')
    .notEmpty().withMessage('El apellido es obligatorio')
    .isString().withMessage('El apellido debe ser texto'),
  body('telefono')
    .notEmpty().withMessage('El teléfono es obligatorio')
    .isLength({ min: 8}).withMessage('El teléfono debe tener  8  dígitos'),
  body('correo')
    .notEmpty().withMessage('El correo es obligatorio')
    .isEmail().withMessage('Debe ser un correo electrónico válido'),
  body('direccion')
    .notEmpty().withMessage('La dirección es obligatoria')
];


router.post('/', validarCliente, agregarCliente);

router.get('/', listarClientesCtrl);

router.put('/:id', validarId, validarCliente, editarClienteCtrl);

router.delete('/:id', validarId, eliminarClienteCtrl);


export default router;