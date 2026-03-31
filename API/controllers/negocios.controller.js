const { connDB } = require('../database');

const obtenerNegocios = async (req, res) => {
    try {
        const query = `SELECT n.*, u.municipio, u.estado FROM Negocios n LEFT JOIN Ubicacion u ON n.idUbicacion = u.idUbicacion`;
        const [rows] = await connDB.query(query);
        res.json(rows);
    } catch (error) {
        res.status(500).send(error);
    }
};

const obtenerNegocioPorId = async (req, res) => {
    try {
        const query = `
            SELECT n.*, u.municipio, u.estado, sn.nombre AS subtipo, cn.nombre AS categoria
            FROM Negocios n
            LEFT JOIN Ubicacion u ON n.idUbicacion = u.idUbicacion
            LEFT JOIN Subcategorias_Negocio sn ON n.idSubcategoria = sn.idSubcategoria
            LEFT JOIN Categorias_Negocio cn ON sn.idCategoria_Negocio = cn.idCategoria_Negocio
            WHERE n.idNegocio = ?
        `;
        const [rows] = await connDB.query(query, [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ message: "Negocio no encontrado" });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).send(error);
    }
};

const obtenerNegociosMapa = async (req, res) => {
    try {
        const query = `
            SELECT n.idNegocio, n.nombre, n.telefono, n.idSubcategoria, u.latitud, u.longitud, u.calle, u.numero, u.colonia
            FROM negocios n JOIN ubicacion u ON n.idUbicacion = u.idUbicacion
        `;
        const [rows] = await connDB.query(query);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener datos", error });
    }
};

const crearNegocio = async (req, res) => {
    const { nombre, horario, telefono, idSubcategoria, ubicacion } = req.body;
    // ubicacion debe ser un objeto: { latitud, longitud, municipio, estado, calle, numero, colonia }

    const connection = await connDB.getConnection(); // Tomamos una conexión exclusiva para la transacción
    
    try {
        await connection.beginTransaction(); // Iniciamos la transacción

        // 1. Insertamos la ubicación
        const queryUbicacion = `INSERT INTO Ubicacion (latitud, longitud, municipio, estado, calle, numero, colonia) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const [resultUbicacion] = await connection.query(queryUbicacion, [ubicacion.latitud, ubicacion.longitud, ubicacion.municipio, ubicacion.estado, ubicacion.calle, ubicacion.numero, ubicacion.colonia]);
        
        const idUbicacion = resultUbicacion.insertId;

        // 2. Insertamos el negocio enlazando el ID de la ubicación
        const queryNegocio = `INSERT INTO Negocios (nombre, horario, telefono, idSubcategoria, idUbicacion) VALUES (?, ?, ?, ?, ?)`;
        const [resultNegocio] = await connection.query(queryNegocio, [nombre, horario, telefono, idSubcategoria, idUbicacion]);

        await connection.commit(); // Confirmamos los cambios en ambas tablas
        res.status(201).json({ message: 'Negocio creado con éxito', idNegocio: resultNegocio.insertId });

    } catch (error) {
        await connection.rollback(); // Si algo falla, deshacemos TODO para no dejar datos a medias
        res.status(500).json({ message: "Error al crear el negocio", error });
    } finally {
        connection.release(); // Liberamos la conexión de vuelta al pool
    }
};

const actualizarNegocio = async (req, res) => {
    const { nombre, horario, telefono, idSubcategoria } = req.body;
    try {
        const query = `UPDATE Negocios SET nombre = ?, horario = ?, telefono = ?, idSubcategoria = ? WHERE idNegocio = ?`;
        const [result] = await connDB.query(query, [nombre, horario, telefono, idSubcategoria, req.params.id]);
        
        if (result.affectedRows === 0) return res.status(404).json({ message: "Negocio no encontrado" });
        res.status(200).json({ message: "Negocio actualizado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar", error });
    }
};

const eliminarNegocio = async (req, res) => {
    try {
        const query = `DELETE FROM Negocios WHERE idNegocio = ?`;
        const [result] = await connDB.query(query, [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: "Negocio no encontrado" });
        res.status(200).json({ message: "Negocio eliminado" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar (Verifica que no tenga reservas asociadas)", error });
    }
};

module.exports = { obtenerNegocios, obtenerNegocioPorId, obtenerNegociosMapa, crearNegocio, actualizarNegocio, eliminarNegocio };
