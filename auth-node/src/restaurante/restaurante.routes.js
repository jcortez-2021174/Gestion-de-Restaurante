import { Router } from 'express';
import { createRestaurante } from './restaurante.controller.js';
import { getRestaurantes } from './restaurante.controller.js';
import { validateCreateRestaurante } from '../../middlewares/restaurante-validator.js';

const router = Router();

router.post('/', validateCreateRestaurante, createRestaurante);
router.get('/', getRestaurantes);

export default router;
