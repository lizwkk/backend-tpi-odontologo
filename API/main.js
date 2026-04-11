const router = require("express").Router();
const verificarLog = require("./verificarLog"); 

// Definimos las rutas principales
router.use("/usuarios", require("./routes/usuarios"));
router.use("/login", require("./routes/login"));

// Rutas protegidas (necesitan token)
router.use("/turnos", verificarLog(["user", "admin"]), require("./routes/turnos"));
router.use("/profesionales", verificarLog(["user", "admin"]), require("./routes/profesionales"));

module.exports = router;