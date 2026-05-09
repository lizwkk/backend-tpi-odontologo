const router = require('express').Router();
const db = require('../../conexion'); 
const { hashPass } = require("@damianegreco/hashpass");
const verificarLog = require("../verificarLog"); 

router.post("/", function(req, res) {
    const { nombre, email, pass, rol } = req.body;
    
    // 1. Verificación: Si falta algo, avisamos antes de tocar la DB
    if (!nombre || !email || !pass) {
        return res.status(400).send("Faltan datos obligatorios (nombre, email o pass)");
    }

    // 2. IMPORTANTE: Usamos "user" en vez de "paciente" para que 
    // después el login no se confunda.
    const rolFinal = rol || "user"; 

    try {
        // 3. Hasheamos la pass que viene de React
        const passHasheada = hashPass(pass);

        // 4. SQL: Asegurate que en tu phpMyAdmin las columnas se llamen así
        const sql = 'INSERT INTO usuarios (nombre, email, pass_hash, rol) VALUES (?, ?, ?, ?)';

        db.query(sql, [nombre, email, passHasheada, rolFinal])
        .then(() => {
            res.status(201).json({ status: "ok", message: "Usuario registrado con éxito" });
        })
        .catch((error) => {
            // Si el email ya existe en la DB
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(400).send("El email ya está registrado");
            }
            console.error("ERROR REAL EN LA DB:", error); // Esto se ve en la terminal negra
            res.status(500).send("Error en la base de datos: revisá los nombres de las columnas");
        });
    } catch (e) {
        console.error("Error al hashear:", e);
        res.status(500).send("Error al procesar la contraseña");
    }
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