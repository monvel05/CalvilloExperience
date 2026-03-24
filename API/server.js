const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;

// Importaciones de configuracion
const logsRoutes = require('./routes/logs.routes');
const { connDB } = require('./database');

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/logs', logsRoutes);

// Middleware personalizado para detectar el idioma
// 1. Importas tu nuevo middleware
const detectLanguage = require('./middleware/language'); 
app.use(detectLanguage);

const loginRoutes = require('./routes/login.routes');
const publicacionesRoutes = require('./routes/publicaciones.routes');

// Rutas API
app.use('/api', publicacionesRoutes);
app.use('/api', loginRoutes);


// ==========================================
// RUTAS DE USUARIOS
// ==========================================

// Registrar Usuario (Validado con tabla Usuarios)
app.post('/usuarios', async (req, res) => {
    const { nombre, fechaNacimiento, correo, contraseña, idTipoUsuario, idGenero, idIdioma } = req.body;

    if (!nombre || !correo || !contraseña) {
        return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    try {
        // 1. Tipado: Convertimos a número para asegurar que la DB reciba el tipo correcto
        const tipoId = parseInt(idTipoUsuario);
        const generoId = parseInt(idGenero);
        const idiomaId = parseInt(idIdioma);

        // 2. Seguridad: Encriptado de contraseña
        const hashedPassword = await bcrypt.hash(contraseña, 10);
        
        const query = `INSERT INTO Usuarios (nombre, fechaNacimiento, correo, contraseña, idTipoUsuario, idGenero, idIdioma) VALUES (?, ?, ?, ?, ?, ?, ?)`;

        connDB.query(query, [nombre, fechaNacimiento, correo, hashedPassword, tipoId, generoId, idiomaId], (err, result) => {
            if (err) {
                // 3. Validación de duplicados: Si el correo ya existe (Requiere UNIQUE en la DB)
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ message: "El correo electrónico ya está registrado" });
                }
                return res.status(500).json({ message: "Error al registrar", error: err });
            }
            res.status(201).json({ message: 'Usuario registrado correctamente', id: result.insertId });
        });
    } catch (error) {
        res.status(500).json({ message: "Error interno", error });
    }
});

// Obtener un usuario por ID
app.get('/usuarios/:id', (req, res) => {
    const query = `SELECT idUsuario, nombre, correo, idTipoUsuario FROM Usuarios WHERE idUsuario = ?`;
    connDB.query(query, [req.params.id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result[0]);
    });
});

// ==========================================
// RUTAS DE NEGOCIOS
// ==========================================

// Obtener todos los negocios con su ubicacion
app.get('/negocios', (req, res) => {
    const query = `
        SELECT n.*, u.municipio, u.estado 
        FROM Negocios n
        LEFT JOIN Ubicacion u ON n.idUbicacion = u.idUbicacion`;
    
    connDB.query(query, (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

// ==========================================
// RUTAS DE RESERVAS
// ==========================================

// Crear una nueva reserva
app.post('/reservas', (req, res) => {
    const { fechaEntrada, fechaSalida, horaEntrada, horaSalida, idUsuario, idNegocio, idEstatus } = req.body;
    
    const query = `INSERT INTO Reservas (fechaEntrada, fechaSalida, horaEntrada, horaSalida, idUsuario, idNegocio, idEstatus) VALUES (?, ?, ?, ?, ?, ?, ?)`;

    connDB.query(query, [fechaEntrada, fechaSalida, horaEntrada, horaSalida, idUsuario, idNegocio, idEstatus || 1], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.status(201).json({ message: 'Reserva creada con exito', idReserva: result.insertId });
    });
});

// ==========================================
// RUTAS DE RESEÑAS
// ==========================================

// Publicar una reseña
app.post('/resenas', (req, res) => {
    const { calificacion, comentario, idUsuario, idNegocio } = req.body;
    const fecha = new Date().toISOString().split('T')[0];

    const query = `INSERT INTO Resenas (calificacion, comentario, fecha, idUsuario, idNegocio) VALUES (?, ?, ?, ?, ?)`;

    connDB.query(query, [calificacion, comentario, fecha, idUsuario, idNegocio], (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(201).json({ message: 'Reseña enviada correctamente' });
    });
});

// Inicio del servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});

// ==========================================
// DASHBOARD
// ==========================================

// Obtener ganancias totales
app.get('/api/dashboard/ganancias', (req, res) => {
    const query = `
        SELECT SUM(p.monto) AS total 
        FROM pagos p
        INNER JOIN usuarios u ON p.idUsuario = u.idUsuario
        WHERE u.idTipoUsuario = 3
    `;

    connDB.query(query, (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result[0]); // Retorna { total: acumulado }
    });
});

// membresias 
app.get('/api/dashboard/membresias', (req, res) => {
    const query = `
        SELECT p.tipo_membresia, COUNT(*) AS total
        FROM pagos p
        INNER JOIN usuarios u ON p.idUsuario = u.idUsuario
        WHERE u.idTipoUsuario = 3
        GROUP BY p.tipo_membresia
    `;

    connDB.query(query, (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result); 
    });
});

//ganancias por mes
app.get('/api/dashboard/ganancias-mensuales', (req, res) => {
    const query = `
        SELECT MONTH(p.fecha) AS mes, SUM(p.monto) AS total
        FROM pagos p
        INNER JOIN usuarios u ON p.idUsuario = u.idUsuario
        WHERE u.idTipoUsuario = 3
        GROUP BY mes
        ORDER BY mes
    `;

    connDB.query(query, (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
});

//Total de usuarios 
app.get('/api/dashboard/usuarios', (req, res) => {
    const query = `SELECT COUNT(*) AS total FROM usuarios`;

    connDB.query(query, (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result[0]);
    });
});

// Total de Turistas (Filtrando por idTipoUsuario = 2)
app.get('/api/dashboard/turistas', (req, res) => {
    const query = `SELECT COUNT(*) AS total FROM Usuarios WHERE idTipoUsuario = 2`;

    connDB.query(query, (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result[0]);
    });
});

// Total de Usuarios tipo Negocio (Filtrando por idTipoUsuario = 3)
app.get('/api/dashboard/negocios', (req, res) => {
    const query = `SELECT COUNT(*) AS total FROM Usuarios WHERE idTipoUsuario = 3`;

    connDB.query(query, (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result[0]);
    });
});

// Obtener distribución de usuarios por género
app.get('/api/dashboard/generos', (req, res) => {
    const query = `
        SELECT g.genero, COUNT(u.idUsuario) AS total
        FROM usuarios u
        INNER JOIN generos g ON u.idGenero = g.idGenero
        GROUP BY g.genero
    `;

    connDB.query(query, (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
});

// Obtener lista completa de negocios para el directorio
app.get('/api/dashboard/lista-negocios', (req, res) => {
    const query = `
        SELECT 
            n.idNegocio,
            n.nombre,
            cn.nombre AS categoria,
            COALESCE(
                (SELECT p.tipo_membresia 
                 FROM usuarios u 
                 INNER JOIN pagos p ON u.idUsuario = p.idUsuario 
                 WHERE u.nombre = n.nombre AND u.idTipoUsuario = 3 
                 ORDER BY p.fecha DESC LIMIT 1), 
                'Sin Membresia'
            ) AS membresia
        FROM negocios n
        INNER JOIN subtipos_negocio sn ON n.idSubtipo_Negocio = sn.idSubtipo_Negocio
        INNER JOIN categorias_negocio cn ON sn.idCategoria_Negocio = cn.idCategoria_Negocio
        ORDER BY n.nombre ASC
    `;

    connDB.query(query, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// ==========================================
// MAPA
// ====
app.post('/logs', (req, res) => {
  res.status(200).send({ status: 'ok' });
});