const router = require("express").Router();
const db = require("../../conexion");
const verificarLog = require("../verificarLog"); 

router.get("/", verificarLog(["user", "admin"]), function(req, res, next) {
    const usuarioId = req.user.id; 
    const sql = `
      SELECT t.*, p.nombre AS profesional_nombre, p.especialidad AS profesional_especialidad
      FROM turnos t
      JOIN profesionales p ON p.id = t.profesional_id
      WHERE t.usuario_id = ?
      ORDER BY t.fecha DESC, t.hora DESC
    `;

    db.query(sql, [usuarioId])
    .then(([resultado]) => {
        res.status(200).json(resultado);
    })
    .catch((error) => {
        console.error("Error al obtener turnos: ", error);
        res.status(500).send("Error al obtener los turnos");
    });
});

// POST /api/turnos
router.post("/", verificarLog(["user"]), function(req, res, next) {
    const usuarioId = req.user.id;
    const { profesional_id, fecha, hora, notas } = req.body;
    const sql = "INSERT INTO turnos (usuario_id, profesional_id, fecha, hora, notas, estado) VALUES (?, ?, ?, ?, ?, 'reservado')";

    db.query(sql, [usuarioId, profesional_id, fecha, hora, notas])
    .then(() => {
        res.status(201).send("Turno creado");
    })
    .catch((error) => {
        console.error("Error al crear turno: ", error);
        res.status(500).send("Error al crear turno");
    });
});

// DELETE /api/turnos/:id
router.delete("/:id", verificarLog(["user", "admin"]), function(req, res, next) {
    const { id } = req.params;
    const usuarioId = req.user.id;
    const rol = req.user.rol;

    let sql = "DELETE FROM turnos WHERE id = ? AND usuario_id = ?";
    let params = [id, usuarioId];

    if (rol === "admin") {
        sql = "DELETE FROM turnos WHERE id = ?";
        params = [id];
    }

    db.query(sql, params)
    .then(() => {
        res.status(200).send("Turno eliminado");
    })
    .catch((error) => {
        console.error("Error al eliminar turno: ", error);
        res.status(500).send("Error al eliminar turno");
    });
});

module.exports = router;