const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { connDB } = require("../database");

exports.login = async (req, res) => {
    console.log("¡Recibiendo petición de login!");
    const { correo, contraseña } = req.body;
    console.log("Intento de login para:", correo);

    try {
        const query = "SELECT * FROM Usuarios WHERE correo = ?";
        const [results] = await connDB.query(query, [correo]); // Uso de promesas

        if (results.length === 0) {
            return res.status(401).json({ message: "Usuario no encontrado" });
        }

        const user = results[0];
        
        // Comparamos el hash de la DB con la contraseña recibida
        const isMatch = await bcrypt.compare(contraseña, user.contraseña);

        if (!isMatch) {
            return res.status(401).json({ message: "Contraseña incorrecta" });
        }

        // Generar Token JWT
        const token = jwt.sign(
            { id: user.idUsuario, rol: user.idTipoUsuario },
            "secreto", // En producción usa variables de entorno
            { expiresIn: "1h" }
        );

        // Devolvemos la respuesta formateada para DatosUsuario de Angular
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

    } catch (error) {
        console.error("Error en el login:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};