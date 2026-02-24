const mysql = require("mysql2");

const db = mysql.createConnection({
  host: process.env.DBHOST,
  user: process.env.DBUSER,
  password: process.env.DBPASS,
  database: process.env.DBNAME,
});

db.connect((err) => {
  if (err) console.log("Error DB:", err);
  else console.log("DB conectada");
});

module.exports = db;