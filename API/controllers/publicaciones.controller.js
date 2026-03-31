const { connDB } = require('../database');

const obtenerPublicaciones = async (req, res) => {
    try {
        const query = `
            SELECT P.idPublicacion, P.descripcion, P.fecha, U.nombre, 
                   MAX(F.link) AS foto, COUNT(DISTINCT L.idUsuario) AS likes
            FROM Publicaciones P
            JOIN Usuarios U ON P.idUsuario = U.idUsuario
            LEFT JOIN Likes_Publicaciones L ON P.idPublicacion = L.idPublicacion
            LEFT JOIN Fotos_Publicaciones F ON P.idPublicacion = F.idPublicacion
            GROUP BY P.idPublicacion
            ORDER BY P.fecha DESC
        `;
        const [rows] = await connDB.query(query);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener publicaciones", error });
    }
};

const crearPublicacion = async (req, res) => {
    const { descripcion, idUsuario, idNegocio, linkFoto } = req.body;
    try {
        const query = `INSERT INTO Publicaciones (descripcion, fecha, idUsuario, idNegocio) VALUES (?, NOW(), ?, ?)`;
        const [result] = await connDB.query(query, [descripcion, idUsuario, idNegocio]);
        
        if (linkFoto) {
            const queryFoto = `INSERT INTO Fotos_Publicaciones (idPublicacion, link) VALUES (?, ?)`;
            await connDB.query(queryFoto, [result.insertId, linkFoto]);
        }
        res.status(201).json({ message: "Publicación creada" });
    } catch (error) {
        res.status(500).json({ message: "Error al crear publicación", error });
    }
};

const darLike = async (req, res) => {
    try {
        const query = `INSERT IGNORE INTO Likes_Publicaciones (idUsuario, idPublicacion) VALUES (?, ?)`;
        await connDB.query(query, [req.body.idUsuario, req.params.id]);
        res.json({ message: "Like agregado" });
    } catch (error) {
        res.status(500).json({ message: "Error al dar like", error });
    }
};

const eliminarPublicacion = async (req, res) => {
    const id = req.params.id;
    try {
        // Ejecutamos las eliminaciones de forma lineal gracias a await
        await connDB.query(`DELETE FROM Likes_Publicaciones WHERE idPublicacion = ?`, [id]);
        await connDB.query(`DELETE FROM Fotos_Publicaciones WHERE idPublicacion = ?`, [id]);
        await connDB.query(`DELETE FROM Publicaciones WHERE idPublicacion = ?`, [id]);
        
        res.json({ message: "Publicación eliminada" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar publicación", error });
    }
};

module.exports = { obtenerPublicaciones, crearPublicacion, darLike, eliminarPublicacion };