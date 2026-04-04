const router = require("express").Router();
const db = require("../../conexion");
const verificarLog = require("../verificarLog");


router.get("/", verificarLog(["paciente", "admin"]), async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM profesionales ORDER BY nombre ASC");
    res.json(rows);
  } catch (err) {
    res.status(500).send("Error al obtener profesionales");
  }
});

router.post("/", verificarLog(["admin"]), async (req, res) => {
  try {
    const { nombre, especialidad } = req.body;
    await db.query("INSERT INTO profesionales (nombre, especialidad) VALUES (?, ?)", [nombre, especialidad]);
    res.status(201).send("Profesional agregado");
  } catch (err) {
    res.status(500).send("Error al guardar profesional");
  }
});

module.exports = router;