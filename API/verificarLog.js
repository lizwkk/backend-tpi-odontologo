const { verificarToken } = require('@damianegreco/hashpass');
const { TOKEN_SECRET } = process.env;

const verificarLog = (roles = []) => {
    return function (req, res, next) {
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).send("Token no proporcionado");
        }

        const verificacion = verificarToken(token, TOKEN_SECRET);

        if (verificacion?.data && roles.includes(verificacion.data.rol)) {
            req.user = verificacion.data;
            next();
        } else {
            res.status(401).send("Token inválido o permisos insuficientes");
        }
    }
};

module.exports = verificarLog;