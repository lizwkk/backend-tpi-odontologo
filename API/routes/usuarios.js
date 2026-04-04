const router = require('express').Router();
const db = require('../../conexion'); 
const { hashPass } = require("@damianegreco/hashpass");
const verificarLog = require("../verificarLog"); 

router.post("/", function(req, res) {
    const { nombre, email, pass } = req.body;
    const sql = 'INSERT INTO usuarios (nombre, email, pass, rol) VALUES (?, ?, ?, "paciente")';
    const passHasheada = hashPass(pass);

    db.query(sql, [nombre, email, passHasheada])
    .then(() => {
        res.status(201).send("Usuario registrado con éxito");
    })
    .catch((error) => {
        console.error(error);
        res.status(500).send("Error al registrar usuario");
    });
});

router.get("/", verificarLog(["admin"]), function(req, res) {
    const sql = 'SELECT id_usuario, nombre, email, rol FROM usuarios';
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