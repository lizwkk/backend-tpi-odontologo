const { verificarToken } = require("@damianegreco/hashpass");
const { TOKEN_SECRET } = process.env;

module.exports = function middleware(req, res, next) {
  const token = req.headers.authorization; // token directo (estilo profe)

  if (!token) return res.status(401).send("Sin permisos");

  const verificacion = verificarToken(token, TOKEN_SECRET);

  if (verificacion?.data) {
    req.user = verificacion.data;
    next();
  } else {
    res.status(401).send("Token inválido");
  }
};