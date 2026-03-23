// src/API/routes/logs.routes.js
const express = require('express');
const router = express.Router();
const connDB = require('../database'); // Asegúrate de que la ruta a tu conexión sea correcta

// Ruta POST para registrar un nuevo evento de minería de datos
router.post('/', (req, res) => {
    // 1. Extraemos los datos que nos enviará Angular
    const { idUsuario, tipoEvento, detalles, plataforma } = req.body;

    // Validación básica: al menos necesitamos saber qué evento ocurrió
    if (!tipoEvento) {
        return res.status(400).json({ message: "El campo tipoEvento es obligatorio" });
    }

    // 2. Capturamos la IP del usuario (muy valioso para minería de datos geográfica)
    // Express nos da varias formas de obtenerla, dependiendo de si usas proxies o no
    const direccionIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    // 3. Preparamos el JSON de detalles. Si Angular manda un objeto, lo convertimos a string para MySQL
    const detallesJSON = detalles ? JSON.stringify(detalles) : null;

    // 4. Preparamos la consulta SQL
    const query = `
        INSERT INTO Logs_Actividad 
        (idUsuario, tipoEvento, detalles, plataforma, direccionIP) 
        VALUES (?, ?, ?, ?, ?)
    `;

    // 5. Ejecutamos la inserción
    // Nota: idUsuario puede ser null si el turista está navegando como invitado
    connDB.query(query, [idUsuario || null, tipoEvento, detallesJSON, plataforma, direccionIP], (err, result) => {
        if (err) {
            console.error("Error al guardar el log:", err);
            // Si el log falla, respondemos con error interno
            return res.status(500).json({ message: "Error al registrar la actividad", error: err });
        }
        
        // Respondemos con código 201 (Created) para confirmar que se guardó
        res.status(201).json({ message: "Evento registrado correctamente" });
    });
});

module.exports = router;