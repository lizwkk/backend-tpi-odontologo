const { verificarToken } = require('@damianegreco/hashpass');
const { TOKEN_SECRET } = process.env;

const verificarLog = (roles = []) => {
    return function (req, res, next) {
        // Ignoramos todo y dejamos pasar
        console.log("ACCESO FORZADO PARA PRUEBA: Entrando como Wendy");
        req.user = { id: 12, rol: 'user', nombre: 'wendy' }; 
        next(); 
    }
};

module.exports = verificarLog;