const { connDB } = require('../database');

const crearReserva = async (req, res) => {
    const { fechaEntrada, fechaSalida, horaEntrada, horaSalida, idUsuario, idNegocio, idEstatus } = req.body;
    try {
        const query = `INSERT INTO Reservas (fechaEntrada, fechaSalida, horaEntrada, horaSalida, idUsuario, idNegocio, idEstatus) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const [result] = await connDB.query(query, [fechaEntrada, fechaSalida, horaEntrada, horaSalida, idUsuario, idNegocio, idEstatus || 1]);
        res.status(201).json({ message: 'Reserva creada con exito', idReserva: result.insertId });
    } catch (error) {
        res.status(500).json({ error });
    }
};

module.exports = { crearReserva };