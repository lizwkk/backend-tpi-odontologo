const router = require("express").Router();

// ✅ cada módulo cuelga acá
router.use("/usuarios", require("./routes/usuarios"));
router.use("/turnos", require("./routes/turnos"));
router.use("/profesionales", require("./routes/profesionales"));

module.exports = router;