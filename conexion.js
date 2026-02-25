require("dotenv").config();
const mysql = require("mysql2/promise");

const db = mysql.createPool({
  host: process.env.DBHOST,
  user: process.env.DBUSER,
  password: process.env.DBPASS,
  database: process.env.DBNAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function probarConexion() {
  try {
    await db.query("SELECT 1");
    console.log("DB conectada");
  } catch (err) {
    console.log("Error DB:", err.message);
  }
}
probarConexion();

// ✅ ESTA LÍNEA ES LA CLAVE
module.exports = db;