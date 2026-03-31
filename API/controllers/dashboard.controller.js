const { connDB } = require('../database');

const obtenerGanancias = async (req, res) => {
    try {
        const query = `SELECT SUM(p.monto) AS total FROM pagos p INNER JOIN usuarios u ON p.idUsuario = u.idUsuario WHERE u.idTipoUsuario = 3`;
        const [rows] = await connDB.query(query);
        res.json(rows[0]);
    } catch (error) { res.status(500).json(error); }
};

const obtenerMembresias = async (req, res) => {
    try {
        const query = `SELECT p.tipo_membresia, COUNT(*) AS total FROM pagos p INNER JOIN usuarios u ON p.idUsuario = u.idUsuario WHERE u.idTipoUsuario = 3 GROUP BY p.tipo_membresia`;
        const [rows] = await connDB.query(query);
        res.json(rows);
    } catch (error) { res.status(500).json(error); }
};

const obtenerGananciasMensuales = async (req, res) => {
    try {
        const query = `SELECT MONTH(p.fecha) AS mes, SUM(p.monto) AS total FROM pagos p INNER JOIN usuarios u ON p.idUsuario = u.idUsuario WHERE u.idTipoUsuario = 3 GROUP BY mes ORDER BY mes`;
        const [rows] = await connDB.query(query);
        res.json(rows);
    } catch (error) { res.status(500).json(error); }
};

const obtenerTotalUsuarios = async (req, res) => {
    try {
        const [rows] = await connDB.query(`SELECT COUNT(*) AS total FROM usuarios`);
        res.json(rows[0]);
    } catch (error) { res.status(500).json(error); }
};

const obtenerTotalTuristas = async (req, res) => {
    try {
        const [rows] = await connDB.query(`SELECT COUNT(*) AS total FROM Usuarios WHERE idTipoUsuario = 2`);
        res.json(rows[0]);
    } catch (error) { res.status(500).json(error); }
};

const obtenerTotalNegocios = async (req, res) => {
    try {
        const [rows] = await connDB.query(`SELECT COUNT(*) AS total FROM Usuarios WHERE idTipoUsuario = 3`);
        res.json(rows[0]);
    } catch (error) { res.status(500).json(error); }
};

const obtenerGeneros = async (req, res) => {
    try {
        const query = `SELECT g.genero, COUNT(u.idUsuario) AS total FROM usuarios u INNER JOIN generos g ON u.idGenero = g.idGenero GROUP BY g.genero`;
        const [rows] = await connDB.query(query);
        res.json(rows);
    } catch (error) { res.status(500).json(error); }
};

const obtenerListaNegocios = async (req, res) => {
    try {
        const query = `
            SELECT n.idNegocio, n.nombre, cn.nombre AS categoria,
            COALESCE((SELECT p.tipo_membresia FROM usuarios u INNER JOIN pagos p ON u.idUsuario = p.idUsuario WHERE u.nombre = n.nombre AND u.idTipoUsuario = 3 ORDER BY p.fecha DESC LIMIT 1), 'Sin Membresia') AS membresia
            FROM negocios n
            INNER JOIN subcategorias_negocio sn ON n.idSubcategoria = sn.idSubcategoria
            INNER JOIN categorias_negocio cn ON sn.idCategoria_Negocio = cn.idCategoria_Negocio
            ORDER BY n.nombre ASC
        `;
        const [rows] = await connDB.query(query);
        res.json(rows);
    } catch (error) { res.status(500).json(error); }
};

module.exports = { obtenerGanancias, obtenerMembresias, obtenerGananciasMensuales, obtenerTotalUsuarios, obtenerTotalTuristas, obtenerTotalNegocios, obtenerGeneros, obtenerListaNegocios };