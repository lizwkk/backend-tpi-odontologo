const router = require("express").Router();
const db = require("../../conexion");
const { hashPass } = require("@damianegreco/hashpass");

const loginRouter = require("./login");

// ✅ POST /api/usuarios/login
router.use("/login", loginRouter);

// ✅ POST /api/usuarios/registro
router.post("/registro", (req, res) => {
  const { nombre, email, pass } = req.body;

  if (!nombre || !email || !pass) return res.status(400).send("Faltan datos");

  const pass_hash = hashPass(pass);

  const sql = "INSERT INTO usuarios (nombre, email, pass_hash) VALUES (?, ?, ?)";

  db.query(sql, [nombre, email, pass_hash])
    .then(([result]) => res.status(201).json({ ok: true, id: result.insertId }))
    .catch((err) => {
      console.error(err);
      if (err.code === "ER_DUP_ENTRY") return res.status(409).send("Email ya registrado");
      res.status(500).send("Error al registrar");
    });
});

module.exports = router;