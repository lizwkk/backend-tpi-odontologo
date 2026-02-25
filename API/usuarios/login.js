const router = require("express").Router();
const db = require("../../conexion");

const { verificarPass, generarToken } = require("@damianegreco/hashpass");

router.post("/", (req, res) => {
  try {
    const { email, pass } = req.body;

    if (!email || !pass) return res.status(400).send("Faltan datos");

    const sql = "SELECT id, nombre, email, pass_hash, rol FROM usuarios WHERE email = ?";

    db.query(sql, [email])
      .then(([rows]) => {
        if (rows.length !== 1) return res.status(401).send("Credenciales incorrectas");

        const user = rows[0];

        const ok = verificarPass(pass, user.pass_hash);
        if (!ok) return res.status(401).send("Credenciales incorrectas");

        const datos = {
          id: user.id,
          nombre: user.nombre,
          email: user.email,
          rol: user.rol ?? "user",
        };

        const TOKEN_SECRET = process.env.TOKEN_SECRET;
        if (!TOKEN_SECRET) {
          console.error("Falta TOKEN_SECRET en .env");
          return res.status(500).send("Config inválida (TOKEN_SECRET)");
        }

        const token = generarToken(TOKEN_SECRET, 6, datos);

        res.json({ ok: true, token, user: datos });
      })
      .catch((err) => {
        console.error("Error DB login:", err);
        res.status(500).send("Error en login");
      });
  } catch (err) {
    console.error("Error general login:", err);
    res.status(500).send("Error en login");
  }
});

module.exports = router;