const express = require('express');
const router = express.Router();
// 1. Corregimos la importación agregando las llaves { connDB }
const { connDB } = require('../database'); 

// 2. Agregamos "async" a la función
router.post('/', async (req, res) => {
    const { idUsuario, tipoEvento, detalles, plataforma } = req.body;

    if (!tipoEvento) {
        return res.status(400).json({ message: "El campo tipoEvento es obligatorio" });
    }

    const direccionIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const detallesJSON = detalles ? JSON.stringify(detalles) : null;

    const query = `
        INSERT INTO Logs_Actividad 
        (idUsuario, tipoEvento, detalles, plataforma, direccionIP) 
        VALUES (?, ?, ?, ?, ?)
    `;

    // 3. Usamos el formato moderno try/catch con await
    try {
        await connDB.query(query, [idUsuario || null, tipoEvento, detallesJSON, plataforma, direccionIP]);
        res.status(201).json({ message: "Evento registrado correctamente" });
    } catch (err) {
        console.error("Error al guardar el log:", err);
        res.status(500).json({ message: "Error al registrar la actividad", error: err.message });
    }
});

module.exports = router;