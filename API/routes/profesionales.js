const router = require("express").Router();
const db = require("../../conexion");
const verificarLog = require("../verificarLog");

// GET /api/profesionales
// QUITAMOS el verificarLog de aquí para que el select del Inicio 
// cargue siempre y no te tire el error 401.
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM profesionales ORDER BY nombre ASC");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al obtener profesionales");
  }
});

// POST /api/profesionales
// Este lo dejamos protegido para que solo el admin pueda agregar gente nueva.
// IMPORTANTE: Asegurate de que el rol en tu DB sea "admin" (en minúsculas).
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