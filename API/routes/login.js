const router = require('express').Router();
const { TOKEN_SECRET } = process.env;
const { verificarPass, generarToken } = require("@damianegreco/hashpass");
const db = require('../../conexion');

router.post("/", function(req, res, next) {
    const { email, pass } = req.body;

    // Buscamos usando TUS columnas: id y pass_hash
    let sql = "SELECT id, nombre, email, pass_hash, rol FROM usuarios WHERE email = ?";

    db.query(sql, [email])
    .then(([rows]) => {
        if (rows.length === 1) {
            const usuario = rows[0];
            
            // Verificamos la contraseña con el hash de tu DB
            if (verificarPass(pass, usuario.pass_hash)) {
                
                // PARACAÍDAS: Si el rol está vacío en la DB, le ponemos "user"
                const rolSeguro = usuario.rol || "user";

                const datos = {
                    id: usuario.id,
                    nombre: usuario.nombre,
                    email: usuario.email,
                    rol: rolSeguro
                };

                // Generamos el token (duración 6 horas)
                const token = generarToken(TOKEN_SECRET, 6, datos);

                // Respuesta limpia para el Frontend
                res.json({
                    status: "ok", 
                    token, 
                    rol: rolSeguro, 
                    id: usuario.id, 
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
        console.error("Error en Login:", error);
        res.status(500).send("Ocurrió un error en el servidor");
    });
});

// ¡ESTA LÍNEA ES CLAVE! No la borres
module.exports = router;