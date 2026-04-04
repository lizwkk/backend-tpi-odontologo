require('dotenv').config();
const mysql = require('mysql2/promise');
const { DBNAME, DBUSER, DBPASS, DBHOST } = process.env;

const db = mysql.createPool({
    database: DBNAME,
    user: DBUSER,
    password: DBPASS,
    host: DBHOST,
    connectionLimit: 10,
    queueLimit: 0
});

db.query("SELECT 1")
    .then(() => console.log("Base de datos conectada con éxito"))
    .catch(err => console.log("Error al conectar la BD:", err.message));

module.exports = db;