const express = require('express');
const router = express.Router();
const reservasController = require('../controllers/reservas.controller');

router.post('/', reservasController.crearReserva);
module.exports = router;