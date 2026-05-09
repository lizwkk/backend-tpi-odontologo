const router = require("express").Router();
const verificarLog = require("./verificarLog"); 

// Tus rutas organizadas en la carpeta routes
router.use("/usuarios", require("./routes/usuarios"));
router.use("/login", require("./routes/login"));
router.use("/profesionales", require("./routes/profesionales"));

// Ruta protegida: solo pasan los que tienen token y rol user/admin
router.use("/turnos", verificarLog(["user", "admin"]), require("./routes/turnos"));

// Exportamos el router principal
module.exports = router;