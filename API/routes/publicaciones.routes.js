const express = require("express");
const router = express.Router();
const { connDB } = require("../database");


// =============================
// OBTENER PUBLICACIONES
// =============================
router.get("/publicaciones", (req, res) => {

    const query = `
    SELECT 
        P.idPublicacion,
        P.descripcion,
        P.fecha,
        U.nombre,
        MAX(F.link) AS foto,
        COUNT(DISTINCT L.idUsuario) AS likes
    FROM Publicaciones P
    JOIN Usuarios U 
        ON P.idUsuario = U.idUsuario
    LEFT JOIN Likes_Publicaciones L 
        ON P.idPublicacion = L.idPublicacion
    LEFT JOIN Fotos_Publicaciones F
        ON P.idPublicacion = F.idPublicacion
    GROUP BY P.idPublicacion
    ORDER BY P.fecha DESC
    `;

    connDB.query(query, (err, results) => {

        if (err) {
            console.error(err);
            return res.status(500).json(err);
        }

        res.json(results);

    });

});


// =============================
// CREAR PUBLICACION
// =============================
router.post("/publicaciones", (req, res) => {

    const { descripcion, idUsuario, idNegocio, linkFoto } = req.body;

    const query = `
    INSERT INTO Publicaciones
    (descripcion, fecha, idUsuario, idNegocio)
    VALUES (?, NOW(), ?, ?)
    `;

    connDB.query(query, [descripcion, idUsuario, idNegocio], (err, result) => {

        if (err) {
            console.error(err);
            return res.status(500).json(err);
        }

        const idPublicacion = result.insertId;

        if (linkFoto) {

            const queryFoto = `
            INSERT INTO Fotos_Publicaciones
            (idPublicacion, link)
            VALUES (?, ?)
            `;

            connDB.query(queryFoto, [idPublicacion, linkFoto]);
        }

        res.json({
            message: "Publicación creada"
        });

    });

});


// =============================
// DAR LIKE
// =============================
router.post("/publicaciones/:id/like", (req, res) => {

    const idPublicacion = req.params.id;
    const { idUsuario } = req.body;

    const query = `
    INSERT IGNORE INTO Likes_Publicaciones (idUsuario, idPublicacion)
    VALUES (?, ?)
    `;

    connDB.query(query, [idUsuario, idPublicacion], (err) => {

        if (err) {
            console.error(err);
            return res.status(500).json(err);
        }

        res.json({ message: "Like agregado" });

    });

});


// =============================
// ELIMINAR PUBLICACION
// =============================
router.delete("/publicaciones/:id", (req, res) => {

    const id = req.params.id;

    // borrar likes
    const deleteLikes = `
    DELETE FROM Likes_Publicaciones
    WHERE idPublicacion = ?
    `;

    connDB.query(deleteLikes,[id],(err)=>{

        if(err){
            console.error(err);
            return res.status(500).json(err);
        }

        // borrar fotos
        const deleteFotos = `
        DELETE FROM Fotos_Publicaciones
        WHERE idPublicacion = ?
        `;

        connDB.query(deleteFotos,[id],(err)=>{

            if(err){
                console.error(err);
                return res.status(500).json(err);
            }

            // borrar publicación
            const deletePublicacion = `
            DELETE FROM Publicaciones
            WHERE idPublicacion = ?
            `;

            connDB.query(deletePublicacion,[id],(err)=>{

                if(err){
                    console.error(err);
                    return res.status(500).json(err);
                }

                res.json({
                    message:"Publicación eliminada"
                });

            });

        });

    });

});


module.exports = router;