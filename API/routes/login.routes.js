const express = require("express");
const router = express.Router();

// 1. Importamos el controlador (Asegúrate de que la ruta sea la correcta hacia tu carpeta controllers)
const loginController = require("../controllers/login.controller"); 

// 2. La ruta simplemente le pasa la "batuta" a la función del controlador
router.post("/login", loginController.login);

module.exports = router;