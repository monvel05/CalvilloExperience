const { connDB } = require("../database");

exports.registrarLog = async (req, res) => {
    const { idUsuario, tipoEvento, detalles, plataforma } = req.body;

    if (!tipoEvento) {
        return res.status(400).json({ message: "El campo tipoEvento es obligatorio" });
    }

    try {
        const direccionIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        const detallesJSON = detalles ? JSON.stringify(detalles) : null;

        const query = `
            INSERT INTO Logs_Actividad 
            (idUsuario, tipoEvento, detalles, plataforma, direccionIP) 
            VALUES (?, ?, ?, ?, ?)
        `;

        await connDB.query(query, [idUsuario || null, tipoEvento, detallesJSON, plataforma, direccionIP]);
        
        res.status(201).json({ message: "Evento registrado correctamente" });
    } catch (error) {
        console.error("Error al guardar el log:", error);
        res.status(500).json({ message: "Error al registrar la actividad" });
    }
};