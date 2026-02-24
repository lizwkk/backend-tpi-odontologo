const router = require("express").Router();
const db = require("../../conexion");

// GET /api/profesionales (protegido)
router.get("/", (req, res) => {
  db.query("SELECT * FROM profesionales ORDER BY id DESC", (err, rows) => {
    if (err) return res.status(500).send("Error DB");
    res.json(rows);
  });
});

// POST /api/profesionales (protegido)
router.post("/", (req, res) => {
  const { nombre, especialidad } = req.body;

  if (!nombre || !especialidad) {
    return res.status(400).send("Faltan datos");
  }

  db.query(
    "INSERT INTO profesionales (nombre, especialidad) VALUES (?, ?)",
    [nombre, especialidad],
    (err, result) => {
      if (err) return res.status(500).send("Error DB");
      res.status(201).json({ ok: true, id: result.insertId });
    }
  );
});

// DELETE /api/profesionales/:id (protegido)
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM profesionales WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).send("Error DB");
    res.json({ ok: true });
  });
});

module.exports = router;