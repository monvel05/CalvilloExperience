const mysql = require("mysql2");
// Importamos el objeto environment desde tu carpeta env
const { environment } = require("../env/env.ts"); 

const connDB = mysql.createConnection({
  host: environment.database.host,
  user: environment.database.user,
  password: environment.database.password,
  database: environment.database.database,
});

connDB.connect((error) => {
  if (error) {
    console.log("Error connecting to database: ", error);
  } else {
    console.log("Connected to database successfully!");
  }
});

exports.connDB = connDB;
