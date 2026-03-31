// API/server.js
const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

// Importaciones de rutas modulares
const logsRoutes = require('./routes/logs.routes');
const loginRoutes = require('./routes/login.routes');
const usuariosRoutes = require('./routes/usuarios.routes');
const negociosRoutes = require('./routes/negocios.routes');
const reservasRoutes = require('./routes/reservas.routes');
const publicacionesRoutes = require('./routes/publicaciones.routes');
const dashboardRoutes = require('./routes/dashboard.routes');

// Middlewares Globales
app.use(cors());
app.use(express.json());

// Middleware para detectar el idioma
const detectLanguage = require('./middleware/language'); 
app.use(detectLanguage);

// Registro de Rutas API
app.use('/api/logs', logsRoutes);
app.use('/api', loginRoutes); 
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/negocios', negociosRoutes);
app.use('/api/reservas', reservasRoutes);
app.use('/api/publicaciones', publicacionesRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Endpoint de prueba para logs
app.post('/logs', (req, res) => {
    res.status(200).send({ status: 'ok' });
});

// Inicio del servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});