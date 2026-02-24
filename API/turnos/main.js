const router = require("express").Router();
const db = require("../../conexion");

// GET /api/turnos -> solo turnos del usuario logueado
router.get("/", async (req, res) => {
  try {
    const usuarioId = req.user.id;

    const sql = `
      SELECT 
        t.id, t.usuario_id, t.profesional_id, t.fecha, t.hora, t.notas, t.estado, t.creado_en,
        p.nombre AS profesional_nombre, p.especialidad AS profesional_especialidad
      FROM turnos t
      JOIN profesionales p ON p.id = t.profesional_id
      WHERE t.usuario_id = ?
      ORDER BY t.fecha DESC, t.hora DESC
    `;

    const [rows] = await db.query(sql, [usuarioId]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al obtener turnos");
  }
});

// POST /api/turnos -> crea turno (usuario_id sale del token)
router.post("/", async (req, res) => {
  try {
    const usuarioId = req.user.id;

    // Acepta ambos (por si el front manda camelCase)
    const profesional_id = req.body.profesional_id ?? req.body.profesionalId;
    const { fecha, hora, notas } = req.body;

    if (!profesional_id || !fecha || !hora) {
      return res.status(400).send("Faltan datos");
    }

    // Verifico que exista el profesional
    const [prof] = await db.query("SELECT id FROM profesionales WHERE id = ?", [
      profesional_id,
    ]);
    if (prof.length !== 1) {
      return res.status(404).send("Profesional inexistente");
    }

    // Evitar doble turno mismo profesional/fecha/hora
    const [existe] = await db.query(
      `SELECT id FROM turnos 
       WHERE profesional_id = ? AND fecha = ? AND hora = ? AND estado <> 'cancelado'
       LIMIT 1`,
      [profesional_id, fecha, hora]
    );
    if (existe.length > 0) {
      return res.status(409).send("Ese turno ya está reservado");
    }

    const [result] = await db.query(
      `INSERT INTO turnos (usuario_id, profesional_id, fecha, hora, notas, estado, creado_en)
       VALUES (?, ?, ?, ?, ?, 'activo', NOW())`,
      [usuarioId, profesional_id, fecha, hora, notas ?? null]
    );

    res.status(201).json({ ok: true, id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al crear turno");
  }
});

// DELETE /api/turnos/:id -> borra solo si es del usuario
router.delete("/:id", async (req, res) => {
  try {
    const usuarioId = req.user.id;
    const { id } = req.params;

    const [result] = await db.query(
      "DELETE FROM turnos WHERE id = ? AND usuario_id = ?",
      [id, usuarioId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).send("Turno no encontrado o sin permisos");
    }

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al eliminar turno");
  }
});

module.exports = router;