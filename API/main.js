const router = require("express").Router();

const middleware = require("./middleware");

const usuarios = require("./usuarios/main");
const profesionales = require("./profesionales/main");
const turnos = require("./turnos/main");

// público
router.use("/usuarios", usuarios);

// protegidos
router.use("/profesionales", middleware, profesionales);
router.use("/turnos", middleware, turnos);

router.get("/", (req, res) => res.send("API OK"));

module.exports = router;