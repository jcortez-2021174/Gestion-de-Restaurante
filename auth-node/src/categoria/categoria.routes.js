const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoria.controller');

router.post('/', categoriaController.crear);
router.get('/', categoriaController.listar);
router.get('/:id', categoriaController.obtener);
router.put('/:id', categoriaController.actualizar);
router.delete('/:id', categoriaController.eliminar);

module.exports = router;