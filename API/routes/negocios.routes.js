// src/API/routes/negocios.routes.js (o el nombre que tenga tu archivo)
const express = require('express');
const router = express.Router();
const connDB = require('../database'); // Tu conexión a MySQL

// Ruta para obtener todos los negocios con su descripción en el idioma correcto
router.get('/', (req, res) => {
    // req.lang viene directamente del middleware que acabas de configurar ('es' o 'en')
    const idiomaSolicitado = req.lang; 

    // Hacemos el JOIN con las tablas de traducciones e idiomas
    const query = `
        SELECT 
            n.idNegocio,
            n.nombre,
            n.horario,
            n.telefono,
            nt.descripcion,
            u.municipio, 
            u.estado 
        FROM Negocios n
        LEFT JOIN Ubicacion u ON n.idUbicacion = u.idUbicacion
        LEFT JOIN Negocios_Traducciones nt ON n.idNegocio = nt.idNegocio
        LEFT JOIN Idiomas i ON nt.idIdioma = i.idIdioma
        WHERE i.codigo = ?`; 
    
    // Ejecutamos la consulta pasando la variable del idioma
    connDB.query(query, [idiomaSolicitado], (err, results) => {
        if (err) {
            console.error("Error en la consulta SQL:", err);
            return res.status(500).json({ 
                message: idiomaSolicitado === 'en' ? "Error fetching businesses" : "Error al obtener negocios", 
                error: err 
            });
        }
        res.json(results);
    });
});

module.exports = router;