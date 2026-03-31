// API/database.js
const mysql = require("mysql2/promise");
const { environment } = require("../src/env/env.ts"); 

const pool = mysql.createPool({
  host: environment.database.host,
  user: environment.database.user,
  password: environment.database.password,
  database: environment.database.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool.getConnection()
  .then(conn => {
    console.log("¡Conectado a la base de datos exitosamente mediante Pool!");
    conn.release();
  })
  .catch(error => {
    console.log("Error conectando a la base de datos: ", error);
  });

exports.connDB = pool;