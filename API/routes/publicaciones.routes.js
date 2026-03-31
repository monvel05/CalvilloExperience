const express = require("express");
const router = express.Router();
const { connDB } = require("../database");

// =============================
// OBTENER PUBLICACIONES
// =============================
// Nota: Le quité el "/publicaciones" a las rutas porque en server.js 
// ya le pusimos el prefijo a este archivo. Así evitamos que la ruta sea /api/publicaciones/publicaciones
router.get("/publicaciones", async (req, res) => {
    try {
        const query = `
            SELECT 
                P.idPublicacion,
                P.descripcion,
                P.fecha,
                U.nombre,
                MAX(F.link) AS foto,
                COUNT(DISTINCT L.idUsuario) AS likes
            FROM Publicaciones P
            JOIN Usuarios U ON P.idUsuario = U.idUsuario
            LEFT JOIN Likes_Publicaciones L ON P.idPublicacion = L.idPublicacion
            LEFT JOIN Fotos_Publicaciones F ON P.idPublicacion = F.idPublicacion
            GROUP BY P.idPublicacion
            ORDER BY P.fecha DESC
        `;
        
        const [results] = await connDB.query(query);
        res.json(results);

    } catch (error) {
        console.error("Error al obtener publicaciones:", error);
        res.status(500).json({ message: "Error al obtener publicaciones", error: error.message });
    }
});

// =============================
// CREAR PUBLICACION
// =============================
router.post("/publicaciones", async (req, res) => {
    const { descripcion, idUsuario, idNegocio, linkFoto } = req.body;

    try {
        const query = `
            INSERT INTO Publicaciones (descripcion, fecha, idUsuario, idNegocio)
            VALUES (?, NOW(), ?, ?)
        `;
        
        const [result] = await connDB.query(query, [descripcion, idUsuario, idNegocio]);
        const idPublicacion = result.insertId;

        if (linkFoto) {
            const queryFoto = `INSERT INTO Fotos_Publicaciones (idPublicacion, link) VALUES (?, ?)`;
            await connDB.query(queryFoto, [idPublicacion, linkFoto]);
        }

        res.json({ message: "Publicación creada con éxito", idPublicacion });

    } catch (error) {
        console.error("Error al crear publicación:", error);
        res.status(500).json({ message: "Error al crear publicación", error: error.message });
    }
});

// =============================
// DAR LIKE
// =============================
router.post("/publicaciones/:id/like", async (req, res) => {
    const idPublicacion = req.params.id;
    const { idUsuario } = req.body;

    try {
        const query = `INSERT IGNORE INTO Likes_Publicaciones (idUsuario, idPublicacion) VALUES (?, ?)`;
        await connDB.query(query, [idUsuario, idPublicacion]);
        
        res.json({ message: "Like agregado correctamente" });

    } catch (error) {
        console.error("Error al dar like:", error);
        res.status(500).json({ message: "Error al registrar el like", error: error.message });
    }
});

// =============================
// ELIMINAR PUBLICACION
// =============================
router.delete("/publicaciones/:id", async (req, res) => {
    const idPublicacion = req.params.id;

    try {
        // En lugar de hacer "callbacks anidados" (Callback Hell), 
        // con async/await ejecutamos una tarea tras otra de forma limpia.
        
        const deleteLikes = `DELETE FROM Likes_Publicaciones WHERE idPublicacion = ?`;
        await connDB.query(deleteLikes, [idPublicacion]);

        const deleteFotos = `DELETE FROM Fotos_Publicaciones WHERE idPublicacion = ?`;
        await connDB.query(deleteFotos, [idPublicacion]);

        const deletePub = `DELETE FROM Publicaciones WHERE idPublicacion = ?`;
        await connDB.query(deletePub, [idPublicacion]);

        res.json({ message: "Publicación eliminada correctamente" });

    } catch (error) {
        console.error("Error al eliminar publicación:", error);
        res.status(500).json({ message: "Error al eliminar publicación", error: error.message });
    }
});

module.exports = router;