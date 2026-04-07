const { connDB } = require('../database');

// Función auxiliar para las tablas que SÍ tienen fecha (como Pagos)
const getFiltroFecha = (filtro, columnaFecha) => {
    switch (filtro) {
        case 'hoy':
            return ` AND DATE(${columnaFecha}) = CURDATE()`;
        case '7dias':
            return ` AND DATE(${columnaFecha}) >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)`;
        case 'mes':
            return ` AND MONTH(${columnaFecha}) = MONTH(CURDATE()) AND YEAR(${columnaFecha}) = YEAR(CURDATE())`;
        case 'anio':
            return ` AND YEAR(${columnaFecha}) = YEAR(CURDATE())`;
        default:
            return ''; 
    }
};

const obtenerGanancias = async (req, res) => {
    try {
        const filtro = req.query.filtro;
        // Pagos sí tiene la columna 'fecha', así que aquí sí filtramos
        const condicionFecha = getFiltroFecha(filtro, 'p.fecha');
        
        const query = `SELECT SUM(p.monto) AS total FROM pagos p INNER JOIN usuarios u ON p.idUsuario = u.idUsuario WHERE u.idTipoUsuario = 3 ${condicionFecha}`;
        const [rows] = await connDB.query(query);
        res.json(rows[0]);
    } catch (error) { res.status(500).json(error); }
};

const obtenerMembresias = async (req, res) => {
    try {
        const filtro = req.query.filtro;
        const condicionFecha = getFiltroFecha(filtro, 'p.fecha');

        const query = `SELECT p.tipo_membresia, COUNT(*) AS total FROM pagos p INNER JOIN usuarios u ON p.idUsuario = u.idUsuario WHERE u.idTipoUsuario = 3 ${condicionFecha} GROUP BY p.tipo_membresia`;
        const [rows] = await connDB.query(query);
        res.json(rows);
    } catch (error) { res.status(500).json(error); }
};

const obtenerGananciasMensuales = async (req, res) => {
    try {
        const filtro = req.query.filtro;
        const condicionFecha = getFiltroFecha(filtro, 'p.fecha');

        const query = `SELECT MONTH(p.fecha) AS mes, SUM(p.monto) AS total FROM pagos p INNER JOIN usuarios u ON p.idUsuario = u.idUsuario WHERE u.idTipoUsuario = 3 ${condicionFecha} GROUP BY mes ORDER BY mes`;
        const [rows] = await connDB.query(query);
        res.json(rows);
    } catch (error) { res.status(500).json(error); }
};

const obtenerTotalUsuarios = async (req, res) => {
    try {
        const [rows] = await connDB.query(`SELECT COUNT(*) AS total FROM Usuarios`);
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
        // Corregido para que cuente la tabla Negocios y cuadre con tu lista de 30
        const [rows] = await connDB.query(`SELECT COUNT(*) AS total FROM Negocios`);
        res.json(rows[0]);
    } catch (error) { res.status(500).json(error); }
};

const obtenerGeneros = async (req, res) => {
    try {
        const query = `SELECT g.genero, COUNT(u.idUsuario) AS total FROM Usuarios u INNER JOIN Generos g ON u.idGenero = g.idGenero GROUP BY g.genero`;
        const [rows] = await connDB.query(query);
        res.json(rows);
    } catch (error) { res.status(500).json(error); }
};

const obtenerListaNegocios = async (req, res) => {
    try {
        const query = `
            SELECT n.idNegocio, n.nombre, cn.nombre AS categoria,
            COALESCE((SELECT p.tipo_membresia FROM Usuarios u INNER JOIN Pagos p ON u.idUsuario = p.idUsuario WHERE u.nombre = n.nombre AND u.idTipoUsuario = 3 ORDER BY p.fecha DESC LIMIT 1), 'Sin Membresia') AS membresia
            FROM Negocios n
            INNER JOIN Subcategorias_Negocio sn ON n.idSubcategoria = sn.idSubcategoria
            INNER JOIN Categorias_Negocio cn ON sn.idCategoria_Negocio = cn.idCategoria_Negocio
            ORDER BY n.nombre ASC
        `;
        const [rows] = await connDB.query(query);
        res.json(rows);
    } catch (error) { res.status(500).json(error); }
};

module.exports = { 
    obtenerGanancias, 
    obtenerMembresias, 
    obtenerGananciasMensuales, 
    obtenerTotalUsuarios, 
    obtenerTotalTuristas, 
    obtenerTotalNegocios, 
    obtenerGeneros, 
    obtenerListaNegocios 
};