const express = require('express');
const router = express.Router();
// Importamos tu controlador real
const negociosController = require('../controllers/negocios.controller'); 

// Redirigimos cada petición a su función correspondiente usando promesas
router.get('/', negociosController.obtenerNegocios);
router.get('/:id', negociosController.obtenerNegocioPorId);
router.post('/', negociosController.crearNegocio);
router.put('/:id', negociosController.actualizarNegocio);
router.delete('/:id', negociosController.eliminarNegocio);

module.exports = router;