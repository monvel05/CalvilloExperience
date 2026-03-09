// Importacion de dependencias necesarias
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {connDB} = require("../database");

// Inicializacion del enrutador de Express
const router = express.Router();

// Ruta para la autenticacion de usuarios (Login)
router.post("/login", (req, res) => {
    // Extraccion de credenciales desde el cuerpo de la peticion
    const { correo, contraseña } = req.body;

    // Consulta para buscar al usuario por su correo electronico
    const query = "SELECT * FROM usuarios WHERE correo = ?";
    connDB.query(query, [correo], async (err, results) => {
        
        // Manejo de errores en la conexion o consulta a la base de datos
        if (err) return res.status(500).json({ message: "Error en la consulta" });
        
        // Verificacion de existencia del usuario
        if (results.length === 0) return res.status(401).json({ message: "Usuario no encontrado" });

        const user = results[0];

        // Comparacion de la contraseña ingresada con el hash almacenado en la base de datos
        const isMatch = await bcrypt.compare(contraseña, user.contraseña);

        // Si la contraseña no coincide, se deniega el acceso
        if (!isMatch) return res.status(401).json({ message: "Contraseña incorrecta" });

        // Generacion del token JWT con datos del usuario (ID y Rol)
        const token = jwt.sign(
            {
                id: user.idUsuario, 
                rol: user.idTipoUsuario
            },
            "secreto", // Clave secreta para firmar el token
            { expiresIn: "1h" } // El token expira en una hora
        );

        // Respuesta exitosa enviando el token y los datos basicos del usuario
        res.json({ 
            token,
            user: {
                id: user.idUsuario,
                nombre: user.nombre,
                correo: user.correo,
                rol: user.idTipoUsuario
            } 
        });
    });
});

// Exportacion del router para ser utilizado en server.js
module.exports = router;