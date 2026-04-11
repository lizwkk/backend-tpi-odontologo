const router = require('express').Router();
const db = require('../../conexion'); 
const { hashPass } = require("@damianegreco/hashpass");
const verificarLog = require("../verificarLog"); 

// REGISTRO DE USUARIO
router.post("/", function(req, res) {
    const { nombre, email, pass } = req.body;
    
    // 1. Hasheamos la contraseña primero
    const passHasheada = hashPass(pass);

    // 2. Corregimos el nombre de la columna a pass_hash
    const sql = 'INSERT INTO usuarios (nombre, email, pass_hash, rol) VALUES (?, ?, ?, "paciente")';

    db.query(sql, [nombre, email, passHasheada])
    .then(() => {
        res.status(201).json({ status: "ok", message: "Usuario registrado con éxito" });
    })
    .catch((error) => {
        console.error("Error en DB:", error);
        res.status(500).send("Error al registrar usuario");
    });
});

// LISTAR USUARIOS (Solo Admin)
router.get("/", verificarLog(["admin"]), function(req, res) {
    // Corregimos id_usuario por id
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

module.exports = router;