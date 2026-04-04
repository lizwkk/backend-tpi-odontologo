const router = require("express").Router();
const middleware = require("./middleware/middleware");
router.use("/usuarios", require("./routes/usuarios"));
router.use("/turnos", middleware, require("./routes/turnos")); 
router.use("/profesionales", middleware, require("./routes/profesionales"));

module.exports = router;