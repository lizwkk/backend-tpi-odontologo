const router = require("express").Router();
const db = require("../../conexion");
const verificarLog = require("../verificarLog"); 


router.get("/", verificarLog(["paciente", "admin"]), async (req, res) => {
  try {
    const usuarioId = req.user?.id;
    const sql = `
      SELECT t.*, p.nombre AS profesional_nombre, p.especialidad AS profesional_especialidad
      FROM turnos t
      JOIN profesionales p ON p.id = t.profesional_id
      WHERE t.usuario_id = ?
      ORDER BY t.fecha DESC, t.hora DESC
    `;
    const [rows] = await db.query(sql, [usuarioId]);
    res.json(rows);
  } catch (err) {
    res.status(500).send("Error al obtener turnos");
  }
});


router.post("/", verificarLog(["paciente"]), async (req, res) => {
  try {
    const usuarioId = req.user?.id;
    const { profesional_id, fecha, hora, notas } = req.body;
    const sql = "INSERT INTO turnos (usuario_id, profesional_id, fecha, hora, notas, estado) VALUES (?, ?, ?, ?, ?, 'reservado')";
    await db.query(sql, [usuarioId, profesional_id, fecha, hora, notas]);
    res.status(201).send("Turno creado");
  } catch (err) {
    res.status(500).send("Error al crear turno");
  }
});

// DELETE /api/turnos/:id - Eliminar turno propio
router.delete("/:id", verificarLog(["paciente", "admin"]), async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioId = req.user?.id;
    const rol = req.user?.rol;

    let sql = "DELETE FROM turnos WHERE id = ? AND usuario_id = ?";
    let params = [id, usuarioId];

    if (rol === "admin") {
      sql = "DELETE FROM turnos WHERE id = ?";
      params = [id];
    }

    await db.query(sql, params);
    res.send("Turno eliminado");
  } catch (err) {
    res.status(500).send("Error al eliminar turno");
  }
});

module.exports = router;