const router = require("express").Router();

// ✅ cada módulo cuelga acá
router.use("/usuarios", require("./usuarios/main"));
router.use("/turnos", require("./turnos/main"));
router.use("/profesionales", require("./profesionales/main"));

module.exports = router;