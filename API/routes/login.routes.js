const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { connDB } = require("../database");

router.post("/login", async (req, res) => {
    console.log("¡Recibiendo petición de login!");
    const { correo, contraseña } = req.body;
    console.log("Intento de login para:", correo);

    try {
        const query = "SELECT * FROM Usuarios WHERE correo = ?";
        
        // Con el Pool de promesas, usamos await. 
        // mysql2 devuelve un array donde el primer elemento [0] son los resultados.
        const [results] = await connDB.query(query, [correo]);

        if (results.length === 0) {
            return res.status(401).json({ message: "Usuario no encontrado" });
        }

        const user = results[0];
        
        // Comparación de contraseña con bcrypt
        const isMatch = await bcrypt.compare(contraseña, user.contraseña);

        if (!isMatch) {
            return res.status(401).json({ message: "Contraseña incorrecta" });
        }

        // Generar Token JWT
        const token = jwt.sign(
            { id: user.idUsuario, rol: user.idTipoUsuario },
            "secreto", // Nota: En el futuro esto debería ir en una variable de entorno
            { expiresIn: "1h" }
        );

        // Devolvemos la respuesta formateada para tu interfaz DatosUsuario de Angular
        res.json({
            token,
            user: {
                idUsuario: user.idUsuario,
                nombre: user.nombre,
                correo: user.correo,
                idTipoUsuario: user.idTipoUsuario,
                fechaNacimiento: user.fechaNacimiento,
                idGenero: user.idGenero,
                idIdioma: user.idIdioma
            }
        });

    } catch (err) {
        console.error("Error en la consulta de login:", err);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
});

module.exports = router;