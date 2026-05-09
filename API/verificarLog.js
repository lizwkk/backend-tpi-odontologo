const { verificarToken } = require('@damianegreco/hashpass');
const { TOKEN_SECRET } = process.env;

const verificarLog = (roles = []) => {
    return function (req, res, next) {
        let token = req.headers.authorization;

        console.log("--- INICIO VERIFICACIÓN ---");
        console.log("1. Token bruto recibido:", token);

        if (!token) {
            console.log("Error: No llegó el header de autorización");
            return res.status(401).send("Token no proporcionado");
        }

        // Limpieza automática por si llega con 'Bearer'
        if (token.startsWith("Bearer ")) {
            token = token.slice(7, token.length);
            console.log("2. Token limpio (sin Bearer):", token);
        }

        const verificacion = verificarToken(token, TOKEN_SECRET);
        console.log("3. Resultado de la librería:", verificacion);

        if (verificacion?.data && roles.includes(verificacion.data.rol)) {
            console.log("4. ✅ ÉXITO: Usuario identificado:", verificacion.data.rol);
            req.user = verificacion.data;
            next(); 
        } else {
            console.log("4. ❌ FALLO:");
            console.log("- ¿Tiene data?:", !!verificacion?.data);
            console.log("- Rol en token:", verificacion?.data?.rol);
            console.log("- Roles permitidos para esta ruta:", roles);
            
            res.status(401).send("Token inválido o expirado");
        }
    }
};

module.exports = verificarLog;