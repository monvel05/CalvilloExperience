const express = require('express');
const router = express.Router();
const dashController = require('../controllers/dashboard.controller');

router.get('/ganancias', dashController.obtenerGanancias);
router.get('/membresias', dashController.obtenerMembresias);
router.get('/ganancias-mensuales', dashController.obtenerGananciasMensuales);
router.get('/usuarios', dashController.obtenerTotalUsuarios);
router.get('/turistas', dashController.obtenerTotalTuristas);
router.get('/negocios', dashController.obtenerTotalNegocios);
router.get('/generos', dashController.obtenerGeneros);
router.get('/lista-negocios', dashController.obtenerListaNegocios);

module.exports = router;