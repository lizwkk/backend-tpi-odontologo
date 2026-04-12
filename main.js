const router = require("express").Router();
const verificarLog = require("./verificarLog"); 

const loginRouter = require("./routes/login");
const usuariosRouter = require("./routes/usuarios");
const turnosRouter = require("./routes/turnos");
const profesionalesRouter = require("./routes/profesionales");

// Rutas públicas (No necesitan token para funcionar)
router.use("/login", loginRouter);
router.use("/usuarios", usuariosRouter);

// Profesionales: La liberamos un poco para que el paciente 
// pueda ver la lista sin que el 401 trabe el select del Inicio.
router.use("/profesionales", profesionalesRouter);

// Turnos: Esta sí la dejamos protegida porque es delicada.
// Asegurate que en el Login el rol que guardás sea "user" o "admin".
router.use("/turnos", verificarLog(["user", "admin"]), turnosRouter);

module.exports = router;