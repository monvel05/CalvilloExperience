const express = require('express');
const router = express.Router();
const negociosController = require('../controllers/negocios.controller');

router.get('/', negociosController.obtenerNegocios);
router.get('/mapa', negociosController.obtenerNegociosMapa); 
router.get('/:id', negociosController.obtenerNegocioPorId);
router.post('/', negociosController.crearNegocio);
router.put('/:id', negociosController.actualizarNegocio);
router.delete('/:id', negociosController.eliminarNegocio);

module.exports = router;