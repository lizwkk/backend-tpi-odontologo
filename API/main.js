const router = require("express").Router();
const verificarLog = require("./verificarLog"); 

router.use("/usuarios", require("./routes/usuarios"));
router.use("/login", require("./routes/login"));
router.use("/profesionales", require("./routes/profesionales"));

router.use("/turnos", verificarLog(["user", "admin"]), require("./routes/turnos"));

module.exports = router;