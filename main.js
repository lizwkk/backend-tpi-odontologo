const router = require("express").Router();
const verificarLog = require("./verificarLog"); 

const loginRouter = require("./routes/login");
const usuariosRouter = require("./routes/usuarios");
const turnosRouter = require("./routes/turnos");
const profesionalesRouter = require("./routes/profesionales");

router.use("/login", loginRouter);
router.use("/usuarios", usuariosRouter);

router.use("/turnos", verificarLog(["paciente", "admin"]), turnosRouter);
router.use("/profesionales", verificarLog(["paciente", "admin"]), profesionalesRouter);

module.exports = router;