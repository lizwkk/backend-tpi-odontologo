const router = require("express").Router();
const db = require("./conexion");
const { hashPass } = require("@damianegreco/hashpass");

const loginRouter = require("./login");
const turnosRouter = require(".API/routes/turnos");
const profesionalesRouter = require("./API/routes/profesionales");
const usuariosRouter = require("./API/routes/usuarios");

// Montar rutas
router.use("/profesionales", profesionalesRouter);
router.use("/usuarios", usuariosRouter);
router.use("/login", loginRouter);
router.use("/turnos", turnosRouter);

module.exports = router;