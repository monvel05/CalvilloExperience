const { connDB } = require('../database');

const obtenerNegocios = async (req, res) => {
    try {
        const idiomaSolicitado = req.lang || 'es'; 

        // Agregamos una subconsulta para verificar si existe en Inventario
        const query = `
            SELECT 
                n.idNegocio, n.nombre, n.horario, n.telefono, n.verificado,
                nt.descripcion, sn.nombre AS subcategoria, sn.idSubcategoria, cn.nombre AS categoria,
                u.calle, u.numero, u.colonia, u.municipio, u.estado, u.latitud, u.longitud,
                (SELECT IF(COUNT(*) > 0, 1, 0) FROM Inventario i WHERE i.idNegocio = n.idNegocio) AS tieneInventario
            FROM Negocios n
            LEFT JOIN Ubicacion u ON n.idUbicacion = u.idUbicacion
            LEFT JOIN Subcategorias_Negocio sn ON n.idSubcategoria = sn.idSubcategoria
            LEFT JOIN Categorias_Negocio cn ON sn.idCategoria_Negocio = cn.idCategoria_Negocio
            LEFT JOIN Negocios_Traducciones nt ON n.idNegocio = nt.idNegocio
            LEFT JOIN Idiomas i ON nt.idIdioma = i.idIdioma AND i.codigo = ?
        `;
        
        const [rows] = await connDB.query(query, [idiomaSolicitado]);

        const negociosMapeados = rows.map(row => ({
            idNegocio: row.idNegocio,
            nombre: row.nombre,
            descripcion: row.descripcion || 'Sin descripción disponible',
            idSubtipo_Negocio: row.idSubcategoria || 1, 
            categoria: row.categoria || 'General',
            subcategoria: row.subcategoria || '',
            verificado: row.verificado === 1,
            horario: row.horario || 'Horario no especificado',
            telefono: row.telefono || 'Sin teléfono',
            calificacionMedia: 5.0, 
            imagen: ['https://images.unsplash.com/photo-1605651202774-7d573fd3f12d?auto=format&fit=crop&q=80&w=800'],
            precioMinimo: 0,
            ubicacion: {
                direccionCompleta: `${row.calle || ''} ${row.numero || ''}, ${row.colonia || ''}, ${row.municipio || ''}`.trim(),
                municipio: row.municipio || 'Calvillo',
                latitud: row.latitud?.toString() || '0',
                longitud: row.longitud?.toString() || '0'
            },
            // ¡Aquí leemos el 1 o 0 de la base de datos real!
            tieneInventario: row.tieneInventario === 1 
        }));

        res.json(negociosMapeados);
    } catch (error) {
        console.error("Error al obtener negocios:", error);
        res.status(500).json({ message: "Error interno del servidor", error: error.message });
    }
};

const obtenerNegocioPorId = async (req, res) => {
    try {
        const idiomaSolicitado = req.lang || 'es'; 

        const query = `
            SELECT 
                n.idNegocio, n.nombre, n.horario, n.telefono, n.verificado,
                nt.descripcion, sn.nombre AS subcategoria, sn.idSubcategoria, cn.nombre AS categoria,
                u.calle, u.numero, u.colonia, u.municipio, u.estado, u.latitud, u.longitud,
                (SELECT IF(COUNT(*) > 0, 1, 0) FROM Inventario i WHERE i.idNegocio = n.idNegocio) AS tieneInventario
            FROM Negocios n
            LEFT JOIN Ubicacion u ON n.idUbicacion = u.idUbicacion
            LEFT JOIN Subcategorias_Negocio sn ON n.idSubcategoria = sn.idSubcategoria
            LEFT JOIN Categorias_Negocio cn ON sn.idCategoria_Negocio = cn.idCategoria_Negocio
            LEFT JOIN Negocios_Traducciones nt ON n.idNegocio = nt.idNegocio
            LEFT JOIN Idiomas i ON nt.idIdioma = i.idIdioma AND i.codigo = ?
            WHERE n.idNegocio = ?
        `;
        
        const [rows] = await connDB.query(query, [idiomaSolicitado, req.params.id]);
        
        if (rows.length === 0) return res.status(404).json({ message: "Negocio no encontrado" });
        
        const row = rows[0];

        const negocioMapeado = {
            idNegocio: row.idNegocio,
            nombre: row.nombre,
            descripcion: row.descripcion || 'Sin descripción disponible',
            idSubtipo_Negocio: row.idSubcategoria || 1, 
            categoria: row.categoria || 'General',
            subcategoria: row.subcategoria || '',
            verificado: row.verificado === 1,
            horario: row.horario || 'Horario no especificado',
            telefono: row.telefono || 'Sin teléfono',
            calificacionMedia: 5.0, 
            imagen: ['https://images.unsplash.com/photo-1605651202774-7d573fd3f12d?auto=format&fit=crop&q=80&w=800'],
            precioMinimo: 0,
            ubicacion: { 
                direccionCompleta: `${row.calle || ''} ${row.numero || ''}, ${row.colonia || ''}, ${row.municipio || ''}`.trim(),
                municipio: row.municipio || 'Calvillo',
                latitud: row.latitud?.toString() || '0',
                longitud: row.longitud?.toString() || '0'
            },
            // ¡Conectado al SQL dinámicamente!
            tieneInventario: row.tieneInventario === 1 
        };

        res.json(negocioMapeado);
    } catch (error) {
        console.error("Error al obtener detalle del negocio:", error);
        res.status(500).json({ message: "Error interno del servidor", error: error.message });
    }
};

const obtenerNegociosMapa = async (req, res) => {
    try {
        const query = `
            SELECT n.idNegocio, n.nombre, n.telefono, n.idSubcategoria, u.latitud, u.longitud, u.calle, u.numero, u.colonia
            FROM Negocios n JOIN Ubicacion u ON n.idUbicacion = u.idUbicacion
        `;
        const [rows] = await connDB.query(query);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener datos", error });
    }
};

const crearNegocio = async (req, res) => {
    const { nombre, horario, telefono, idSubcategoria, ubicacion } = req.body;
    const connection = await connDB.getConnection(); 
    
    try {
        await connection.beginTransaction(); 

        const queryUbicacion = `INSERT INTO Ubicacion (latitud, longitud, municipio, estado, calle, numero, colonia) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const [resultUbicacion] = await connection.query(queryUbicacion, [ubicacion.latitud, ubicacion.longitud, ubicacion.municipio, ubicacion.estado, ubicacion.calle, ubicacion.numero, ubicacion.colonia]);
        
        const idUbicacion = resultUbicacion.insertId;

        const queryNegocio = `INSERT INTO Negocios (nombre, horario, telefono, idSubcategoria, idUbicacion) VALUES (?, ?, ?, ?, ?)`;
        const [resultNegocio] = await connection.query(queryNegocio, [nombre, horario, telefono, idSubcategoria, idUbicacion]);

        await connection.commit(); 
        res.status(201).json({ message: 'Negocio creado con éxito', idNegocio: resultNegocio.insertId });

    } catch (error) {
        await connection.rollback(); 
        res.status(500).json({ message: "Error al crear el negocio", error });
    } finally {
        connection.release(); 
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
        res.status(500).json({ message: "Error al eliminar", error });
    }
};

module.exports = { obtenerNegocios, obtenerNegocioPorId, obtenerNegociosMapa, crearNegocio, actualizarNegocio, eliminarNegocio };