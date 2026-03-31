const bcrypt = require('bcrypt');
const { connDB } = require('../database');

const registrarUsuario = async (req, res) => {
    const { nombre, fechaNacimiento, correo, contraseña, idTipoUsuario, idGenero, idIdioma } = req.body;

    if (!nombre || !correo || !contraseña) {
        return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    try {
        const tipoId = parseInt(idTipoUsuario);
        const generoId = parseInt(idGenero);
        const idiomaId = parseInt(idIdioma);
        const hashedPassword = await bcrypt.hash(contraseña, 10);
        
        const query = `INSERT INTO Usuarios (nombre, fechaNacimiento, correo, contraseña, idTipoUsuario, idGenero, idIdioma) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const [result] = await connDB.query(query, [nombre, fechaNacimiento, correo, hashedPassword, tipoId, generoId, idiomaId]);
        
        res.status(201).json({ message: 'Usuario registrado correctamente', id: result.insertId });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: "El correo electrónico ya está registrado" });
        }
        res.status(500).json({ message: "Error interno", error });
    }
};

const obtenerUsuario = async (req, res) => {
    try {
        const query = `SELECT idUsuario, nombre, fechaNacimiento, correo, idTipoUsuario, idGenero, idIdioma FROM Usuarios WHERE idUsuario = ?`;
        const [rows] = await connDB.query(query, [req.params.id]);
        
        if (rows.length === 0) return res.status(404).json({ message: 'Usuario no encontrado' });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).send(error);
    }
};

const actualizarUsuario = async (req, res) => {
    const idUsuario = req.params.id;
    const { nombre, fechaNacimiento, correo, idGenero, idIdioma } = req.body;

    if (!nombre || !correo) return res.status(400).json({ message: "El nombre y el correo son obligatorios" });

    try {
        const generoId = parseInt(idGenero);
        const idiomaId = parseInt(idIdioma);
        const query = `UPDATE Usuarios SET nombre = ?, fechaNacimiento = ?, correo = ?, idGenero = ?, idIdioma = ? WHERE idUsuario = ?`;
        
        const [result] = await connDB.query(query, [nombre, fechaNacimiento, correo, generoId, idiomaId, idUsuario]);
        
        if (result.affectedRows === 0) return res.status(404).json({ message: "Usuario no encontrado" });
        res.status(200).json({ message: "Perfil actualizado correctamente" });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') return res.status(400).json({ message: "Este correo electrónico ya está siendo utilizado" });
        res.status(500).json({ message: "Error interno al actualizar el perfil", error });
    }
};

const eliminarUsuario = async (req, res) => {
    try {
        const query = `DELETE FROM Usuarios WHERE idUsuario = ?`;
        const [result] = await connDB.query(query, [req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.status(200).json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar el usuario", error });
    }
};

module.exports = { registrarUsuario, obtenerUsuario, actualizarUsuario, eliminarUsuario };
