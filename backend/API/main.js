const router = require("express").Router();
const middleware = require("./middleware");

const usuarios = require("./usuarios/main");
const profesionales = require("./profesionales/main");
const turnos = require("./turnos/main");

router.use("/usuarios", usuarios);
router.use("/profesionales", middleware, profesionales);
router.use("/turnos", middleware, turnos);

router.get("/", (req, res) => res.send("API OK"));

// ✅ si tenés db-test, OJO la ruta correcta:
const db = require("../conexion");
router.get("/db-test", (req, res) => {
  db.query("SELECT 1 + 1 AS resultado")
    .then(([rows]) => res.json(rows))
    .catch((err) => {
      console.error(err);
      res.status(500).send("DB error");
    });
});

module.exports = router;