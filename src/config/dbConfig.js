const mysql = require("mysql2/promise");

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
};

const pool = mysql.createPool(dbConfig);

pool
  .getConnection()
  .then((connection) => {
    console.log("Conexión exitosa a la base de datos");
    connection.release();
  })
  .catch((err) => {
    console.log("Fallo al conectar con la base de datos", err);
  });

module.exports = pool;
