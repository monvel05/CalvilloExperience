const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { connDB } = require("../database");

// Nota: Quitamos 'validateRegister' de aquí porque esta es la ruta de login
router.post("/login", (req, res) => {
    console.log("¡Recibiendo petición de login!");
    const { correo, contraseña } = req.body;
    console.log("Intento de login para:", correo);

    const query = "SELECT * FROM Usuarios WHERE correo = ?";
    
    connDB.query(query, [correo], async (err, results) => {
        if (err) return res.status(500).json({ message: "Error en la consulta" });
        if (results.length === 0) return res.status(401).json({ message: "Usuario no encontrado" });

        const user = results[0];
        
        // Comparamos el hash de la DB con la contraseña recibida
        const isMatch = await bcrypt.compare(contraseña, user.contraseña);

        if (!isMatch) {
            return res.status(401).json({ message: "Contraseña incorrecta" });
        }

        // Generar Token JWT
        const token = jwt.sign(
            { id: user.idUsuario, rol: user.idTipoUsuario },
            "secreto",
            { expiresIn: "1h" }
        );

        // ¡CORRECCIÓN AQUÍ! 
        // Devolvemos las variables con los mismos nombres que la interfaz DatosUsuario
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
    });
});

module.exports = router;