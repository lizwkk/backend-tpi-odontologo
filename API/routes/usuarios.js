const router = require('express').Router();
const db = require('../../conexion'); 
const { hashPass } = require("@damianegreco/hashpass");
const verificarLog = require("../verificarLog"); 

router.post("/", function(req, res) {
    // 1. Recibimos los datos. Si el 'rol' no viene en el body, 
    // le ponemos 'paciente' por defecto.
    const { nombre, email, pass, rol } = req.body;
    const rolFinal = rol || "paciente"; 

    if (!nombre || !email || !pass) {
        return res.status(400).send("Faltan datos obligatorios");
    }

    const passHasheada = hashPass(pass);

    // 2. Usamos el rolFinal en la consulta SQL
    const sql = 'INSERT INTO usuarios (nombre, email, pass_hash, rol) VALUES (?, ?, ?, ?)';

    db.query(sql, [nombre, email, passHasheada, rolFinal])
    .then(() => {
        res.status(201).json({ status: "ok", message: "Usuario registrado con éxito" });
    })
    .catch((error) => {
        // Error común: el email ya existe (Duplicate entry)
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).send("El email ya está registrado");
        }
        console.error("Error en DB:", error);
        res.status(500).send("Error al registrar usuario");
    });
});

router.get("/", verificarLog(["admin"]), function(req, res) {
    
    const sql = 'SELECT id, nombre, email, rol FROM usuarios';
    
    db.query(sql)
    .then(([usuarios]) => {
        res.status(200).json({ usuarios });
    })
    .catch((error) => {
        console.error(error);
        res.status(500).send("Error al obtener usuarios");
    });
});
// ELIMINAR USUARIO (CRUD ADMIN)
router.delete("/:id", verificarLog(["admin"]), async (req, res) => {
    const { id } = req.params;
    try {
        // IMPORTANTE: Primero borramos los turnos de ese usuario 
        // para que la base de datos no nos tire error de clave foránea.
        await db.query("DELETE FROM turnos WHERE usuario_id = ?", [id]);
        
        // Ahora sí borramos al usuario
        const [result] = await db.query("DELETE FROM usuarios WHERE id = ?", [id]);
        
        if (result.affectedRows > 0) {
            res.json({ status: "ok", message: "Usuario eliminado correctamente" });
        } else {
            res.status(404).send("Usuario no encontrado");
        }
    } catch (error) {
        console.error("Error al eliminar usuario:", error);
        res.status(500).send("Error interno al intentar eliminar");
    }
});

module.exports = router;