const router = require('express').Router();
const db = require('../../conexion');
const { verificarPass, generarToken } = require("@damianegreco/hashpass");
const { TOKEN_SECRET } = process.env;

router.post("/", function(req, res) {
    const { email, pass } = req.body;
    const sql = "SELECT id_usuario, nombre, email, pass, rol FROM usuarios WHERE email = ?";

    db.query(sql, [email])
    .then(([rows]) => {
        if (rows.length === 1) {
            const usuario = rows[0];
            if (verificarPass(pass, usuario.pass)) {
                const datos = {
                    id: usuario.id_usuario,
                    nombre: usuario.nombre,
                    rol: usuario.rol
                };
                const token = generarToken(TOKEN_SECRET, 6, datos);
                
                res.json({ 
                    status: "ok", 
                    token, 
                    rol: usuario.rol, 
                    id_usuario: usuario.id_usuario, 
                    nombre: usuario.nombre 
                });
            } else {
                res.status(401).send("Contraseña incorrecta");
            }
        } else {
            res.status(401).send("Usuario no encontrado");
        }
    })
    .catch((error) => {
        console.error(error);
        res.status(500).send("Error en el servidor");
    });
});

module.exports = router;