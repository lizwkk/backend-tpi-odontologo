const router = require("express").Router();
const db = require("../../conexion");

// GET /api/profesionales (protegido)
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM profesionales ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error DB");
  }
});

// POST /api/profesionales (protegido)
router.post("/", async (req, res) => {
  try {
    const { nombre, especialidad } = req.body;

    if (!nombre || !especialidad) {
      return res.status(400).send("Faltan datos");
    }

    const [result] = await db.query(
      "INSERT INTO profesionales (nombre, especialidad) VALUES (?, ?)",
      [nombre, especialidad]
    );

    res.status(201).json({ ok: true, id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error DB");
  }
});

// DELETE /api/profesionales/:id (protegido)
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query("DELETE FROM profesionales WHERE id = ?", [id]);

    if (result.affectedRows === 0) return res.status(404).send("No existe");

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error DB");
  }
});

module.exports = router;