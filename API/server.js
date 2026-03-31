const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// ==========================================
// 1. IMPORTACIONES DE CONFIGURACIÓN
// ==========================================
const { connDB } = require('./database');
const detectLanguage = require('./middleware/language'); 

// Importación de todas tus rutas modulares
const logsRoutes = require('./routes/logs.routes');
const loginRoutes = require('./routes/login.routes');
const publicacionesRoutes = require('./routes/publicaciones.routes');
const negociosRoutes = require('./routes/negocios.routes');
const usuariosRoutes = require('./routes/usuarios.routes');
const reservasRoutes = require('./routes/reservas.routes');
const dashboardRoutes = require('./routes/dashboard.routes');

// ==========================================
// 2. MIDDLEWARES GLOBALES
// ==========================================
app.use(cors());
app.use(express.json());
app.use(detectLanguage); // Tu detector de idioma

// ==========================================
// 3. MONTAJE DE RUTAS (El Enchufe Principal)
// ==========================================
// Todas las rutas quedan estandarizadas bajo el prefijo '/api'
app.use('/api', loginRoutes); 
app.use('/api', publicacionesRoutes);
app.use('/api/logs', logsRoutes);
app.use('/api/negocios', negociosRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/reservas', reservasRoutes);
app.use('/api/dashboard', dashboardRoutes);

// ==========================================
// 4. RUTAS HUÉRFANAS (Reseñas)
// ==========================================
// Como no vi un resenas.routes.js, la dejamos aquí pero 
// actualizada a Promesas (async/await) para que no crashee.
app.post('/api/resenas', async (req, res) => {
    const { calificacion, comentario, idUsuario, idNegocio } = req.body;
    const fecha = new Date().toISOString().split('T')[0];

    try {
        const query = `INSERT INTO Resenas (calificacion, comentario, fecha, idUsuario, idNegocio) VALUES (?, ?, ?, ?, ?)`;
        await connDB.query(query, [calificacion, comentario, fecha, idUsuario, idNegocio]);
        res.status(201).json({ message: 'Reseña enviada correctamente' });
    } catch (err) {
        console.error("Error al publicar reseña:", err);
        res.status(500).json({ message: "Error interno", error: err });
    }
});

// ==========================================
// 5. INICIO DEL SERVIDOR
// ==========================================
app.listen(port, () => {
    console.log(`🚀 Servidor corriendo de forma modular en http://localhost:${port}`);
    console.log(`✅ Base de datos conectada. Esperando peticiones...`);
});