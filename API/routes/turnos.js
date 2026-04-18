const router = require("express").Router();
const db = require("../../conexion");
const verificarLog = require("../verificarLog"); 

// 1. OBTENER TODOS LOS TURNOS (PARA EL PANEL ADMIN)
router.get("/admin", verificarLog(["admin"]), function(req, res) {
    const sql = `
      SELECT 
        t.id, 
        t.fecha, 
        t.hora, 
        t.estado, 
        t.notas,
        p.nombre AS profesional_nombre, 
        u.nombre AS paciente_nombre
      FROM turnos t
      INNER JOIN profesionales p ON t.profesional_id = p.id
      INNER JOIN usuarios u ON t.usuario_id = u.id
      ORDER BY t.fecha DESC, t.hora DESC
    `;

    db.query(sql)
    .then(([resultado]) => {
        // Enviamos el array directamente para que lo lea tu Admin.jsx
        res.status(200).json(resultado);
    })
    .catch((error) => {
        console.error("Error admin turnos: ", error);
        res.status(500).send("Error al obtener todos los turnos");
    });
});

// 2. OBTENER TURNOS DEL USUARIO LOGUEADO (MIS TURNOS)
router.get("/mis-turnos", verificarLog(["user", "admin"]), function(req, res) {
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
        console.error("Error al obtener turnos personales: ", error);
        res.status(500).send("Error al obtener tus turnos");
    });
});

// 3. CREAR UN NUEVO TURNO (RESERVAR)
router.post("/", verificarLog(["user", "admin"]), function(req, res) {
    const usuarioId = req.user?.id || req.usuario?.id;
    const { id_profesional, fecha, hora, notas } = req.body;
    
    if (!usuarioId) {
        return res.status(401).json({ message: "No se pudo identificar al usuario. Volvé a loguearte." });
    }

    // Usamos 'usuario_id' y 'profesional_id' que son las columnas de tu tabla
    const sql = `
        INSERT INTO turnos (usuario_id, profesional_id, fecha, hora, notas, estado) 
        VALUES (?, ?, ?, ?, ?, 'activo')
    `;

    db.query(sql, [usuarioId, id_profesional, fecha, hora, notas])
    .then(() => {
        res.status(201).json({ status: "ok", message: "Turno reservado con éxito" });
    })
    .catch((error) => {
        console.error("Error al crear turno: ", error);
        res.status(500).send("Error al procesar la reserva en la base de datos");
    });
});

// 4. ELIMINAR O CANCELAR UN TURNO
router.delete("/:id", verificarLog(["user", "admin"]), function(req, res) {
    const { id } = req.params;
    const usuarioId = req.user?.id || req.usuario?.id;
    const rol = req.user?.rol || req.usuario?.rol;

    let sql = "DELETE FROM turnos WHERE id = ? AND usuario_id = ?";
    let params = [id, usuarioId];

    // Si es admin, puede borrar cualquier turno sin importar el usuario_id
    if (rol === "admin") {
        sql = "DELETE FROM turnos WHERE id = ?";
        params = [id];
    }

    db.query(sql, params)
    .then(() => {
        res.status(200).send("Turno eliminado correctamente");
    })
    .catch((error) => {
        console.error("Error al eliminar turno: ", error);
        res.status(500).send("No se pudo eliminar el turno");
    });
});

module.exports = router;