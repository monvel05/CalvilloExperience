const express = require('express');
const router = express.Router();
const pubController = require('../controllers/publicaciones.controller');

router.get('/', pubController.obtenerPublicaciones);
router.post('/', pubController.crearPublicacion);
router.post('/:id/like', pubController.darLike);
router.delete('/:id', pubController.eliminarPublicacion);

module.exports = router;