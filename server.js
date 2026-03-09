const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const db = require('./database');



app.post('/usuarios', (req, res) => {
    const { nombre, correo, password, rol } = req.body;
    const query = 'INSERT INTO usuarios (nombre, correo, password, rol) VALUES (?, ?, ?, ?)';
    db.query(query, [nombre, correo, password, rol], (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(201).send({ message: 'Usuario registrado', id: result.insertId });
    });
});

app.get('/usuarios/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT id, nombre, correo, rol FROM usuarios WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result[0]);
    });
});

app.post('/sitios', (req, res) => {
    const { nombre, descripcion, tipo, id_dueno } = req.body;
    const query = 'INSERT INTO sitios (nombre, descripcion, tipo, id_dueno) VALUES (?, ?, ?, ?)';
    db.query(query, [nombre, descripcion, tipo, id_dueno], (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(201).send({ message: 'Sitio agregado correctamente' });
    });
});

app.get('/sitios', (req, res) => {
    db.query('SELECT * FROM sitios', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

app.put('/sitios/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;
    const query = 'UPDATE sitios SET nombre = ?, descripcion = ? WHERE id = ?';
    db.query(query, [nombre, descripcion, id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send({ message: 'Sitio actualizado' });
    });
});

app.delete('/sitios/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM sitios WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send({ message: 'Sitio eliminado' });
    });
});

app.listen(port, () => {
    console.log(`Servidor de @Karol corriendo en el puerto ${port}`);
});