const router = require('express').Router();
const { TOKEN_SECRET } = process.env;
const { verificarPass, generarToken } = require("@damianegreco/hashpass");
const db = require('../../conexion');

router.post("/", function(req, res, next) {
    const { email, pass } = req.body;

    // Buscamos al usuario por email
    let sql = "SELECT id, nombre, email, pass_hash, rol FROM usuarios WHERE email = ?";

    db.query(sql, [email])
    .then(([rows]) => {
        if (rows.length === 1) {
            const usuario = rows[0];
            
            // Comparamos la contraseña que envió el usuario con el hash de la BD
            if (verificarPass(pass, usuario.pass_hash)) {
                
                const datos = {
                    id: usuario.id,
                    nombre: usuario.nombre,
                    email: usuario.email,
                    rol: usuario.rol
                };

                // Generamos el token de seguridad
                const token = generarToken(TOKEN_SECRET, 6, datos);

                res.json({
                    status: "ok", 
                    token, 
                    rol: usuario.rol, 
                    id_usuario: usuario.id, 
                    nombre: usuario.nombre
                });
            } else {
                res.status(401).send("Usuario o contraseña incorrectos");
            }
        } else {
            res.status(401).send("Usuario o contraseña incorrectos");
        }
    })
    .catch((error) => {
        console.error(error);
        res.status(500).send("Error interno del servidor");
    });
});

module.exports = router;