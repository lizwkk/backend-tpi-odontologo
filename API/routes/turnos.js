const router = require("express").Router();
const db = require("../../conexion");
const verificarLog = require("../verificarLog"); 

router.get("/admin", verificarLog(["admin"]), function(req, res) {
    const sql = `
      SELECT t.*, p.nombre AS profesional_nombre, u.nombre AS paciente_nombre
      FROM turnos t
      JOIN profesionales p ON p.id = t.profesional_id
      JOIN usuarios u ON u.id = t.usuario_id
      ORDER BY t.fecha DESC, t.hora DESC
    `;

    db.query(sql)
    .then(([resultado]) => {
        res.status(200).json(resultado);
    })
    .catch((error) => {
        console.error("Error admin turnos: ", error);
        res.status(500).send("Error al obtener todos los turnos");
    });
});

router.get("/mis-turnos", verificarLog(["user", "admin"]), function(req, res) {
    // Si tu verificarLog guarda los datos en req.usuario, cambiá .user por .usuario
    const usuarioId = req.user?.id || req.usuario?.id; 
    
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


router.post("/", verificarLog(["user", "admin"]), function(req, res) {
    const usuarioId = req.user?.id || req.usuario?.id;
    const { id_profesional, fecha, hora, notas } = req.body;
    
    const sql = "INSERT INTO turnos (usuario_id, profesional_id, fecha, hora, notas, estado) VALUES (?, ?, ?, ?, ?, 'reservado')";

    db.query(sql, [usuarioId, id_profesional, fecha, hora, notas])
    .then(() => {
        res.status(201).json({ status: "ok", message: "Turno creado" });
    })
    .catch((error) => {
        console.error("Error al crear turno: ", error);
        res.status(500).send("Error al crear turno");
    });
});


router.delete("/:id", verificarLog(["user", "admin"]), function(req, res) {
    const { id } = req.params;
    const usuarioId = req.user?.id || req.usuario?.id;
    const rol = req.user?.rol || req.usuario?.rol;

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