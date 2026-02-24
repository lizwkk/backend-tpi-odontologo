const router = require("express").Router();
const db = require("../../conexion");

/**
 * GET /api/turnos
 * Devuelve SOLO los turnos del usuario logueado
 */
router.get("/", async (req, res) => {
  try {
    const usuarioId = req.user?.id;
    if (!usuarioId) return res.status(401).send("Token inválido");

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

/**
 * POST /api/turnos
 * Crea turno (usuario_id sale del token)
 * Body: { profesional_id, fecha, hora, notas? }
 */
router.post("/", async (req, res) => {
  try {
    const usuarioId = req.user?.id;
    if (!usuarioId) return res.status(401).send("Token inválido");

    // Acepta ambos nombres
    const profesional_id = req.body.profesional_id ?? req.body.profesionalId;
    const { fecha, hora, notas } = req.body;

    if (!profesional_id || !fecha || !hora) {
      return res.status(400).send("Faltan datos");
    }

    // Verificar profesional
    const [prof] = await db.query("SELECT id FROM profesionales WHERE id = ?", [
      profesional_id,
    ]);
    if (prof.length !== 1) {
      return res.status(404).send("Profesional inexistente");
    }

    // Evitar doble turno mismo profesional/fecha/hora (si no está cancelado)
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

/**
 * DELETE /api/turnos/:id
 * Borra solo si el turno es del usuario logueado
 */
router.delete("/:id", async (req, res) => {
  try {
    const usuarioId = req.user?.id;
    if (!usuarioId) return res.status(401).send("Token inválido");

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

/**
 * ✅ OPCIONAL ADMIN
 * GET /api/turnos/all
 * Devuelve TODOS los turnos SOLO si rol=admin
 */
router.get("/all", async (req, res) => {
  try {
    const rol = req.user?.rol;
    if (rol !== "admin") return res.status(403).send("Solo admin");

    const sql = `
      SELECT 
        t.*,
        u.nombre AS usuario_nombre, u.email AS usuario_email,
        p.nombre AS profesional_nombre, p.especialidad AS profesional_especialidad
      FROM turnos t
      JOIN usuarios u ON u.id = t.usuario_id
      JOIN profesionales p ON p.id = t.profesional_id
      ORDER BY t.fecha DESC, t.hora DESC
    `;

    const [rows] = await db.query(sql);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al obtener turnos (admin)");
  }
});

/**
 * ✅ OPCIONAL ADMIN
 * DELETE /api/turnos/admin/:id
 * Admin puede borrar cualquier turno
 */
router.delete("/admin/:id", async (req, res) => {
  try {
    const rol = req.user?.rol;
    if (rol !== "admin") return res.status(403).send("Solo admin");

    const { id } = req.params;

    const [result] = await db.query("DELETE FROM turnos WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).send("Turno no encontrado");
    }

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al eliminar turno (admin)");
  }
});

module.exports = router;