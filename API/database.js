const mysql = require("mysql2/promise"); // Cambiamos a la versión de promesas
const { environment } = require("../src/env/env.ts"); 

// Creamos un Pool en lugar de una conexión única para mayor estabilidad
const pool = mysql.createPool({
  host: environment.database.host,
  user: environment.database.user,
  password: environment.database.password,
  database: environment.database.database,
  waitForConnections: true,
  connectionLimit: 10, // Permite hasta 10 conexiones simultáneas
  queueLimit: 0
});

// Verificamos la conexión al iniciar el servidor
pool.getConnection()
  .then(conn => {
    console.log("✅ ¡Conectado a la base de datos exitosamente mediante Pool!");
    conn.release(); // Liberamos la conexión de prueba
  })
  .catch(error => {
    console.error("❌ Error conectando a la base de datos: ", error);
  });

// Exportamos el pool para usarlo con async/await en las rutas
exports.connDB = pool;