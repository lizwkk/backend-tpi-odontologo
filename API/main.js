const router = require("express").Router();
const verificarLog = require("./verificarLog"); 

router.use("/usuarios", require("./routes/usuarios"));
router.use("/login", require("./routes/login"));

router.use("/turnos", verificarLog(["paciente", "admin"]), require("./routes/turnos"));
router.use("/profesionales", verificarLog(["paciente", "admin"]), require("./routes/profesionales"));

module.exports = router;