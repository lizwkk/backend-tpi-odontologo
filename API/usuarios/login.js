const router = require("express").Router();
const db = require("../../conexion");

const { verificarPass, generarToken } = require("@damianegreco/hashpass");
const { TOKEN_SECRET } = process.env;

router.post("/", (req, res) => {
  const { email, pass } = req.body;

  if (!email || !pass) {
    return res.status(400).send("Faltan datos");
  }

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
        rol: user.rol,
      };

      const token = generarToken(TOKEN_SECRET, 6, datos);

      res.json({ ok: true, token, user: datos });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error en login");
    });
});

module.exports = router;