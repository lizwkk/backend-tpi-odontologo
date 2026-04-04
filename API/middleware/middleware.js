const { verificarToken } = require("@damianegreco/hashpass");
const TOKEN_SECRET = process.env.TOKEN_SECRET;

module.exports = function middleware(req, res, next) {
  const auth = req.headers.authorization;

  if (!auth) {
    return res.status(401).send("Sin token");
  }

  const token = auth.startsWith("Bearer ")
    ? auth.replace("Bearer ", "").trim()
    : auth.trim();

  const verificacion = verificarToken(token, TOKEN_SECRET);

  if (verificacion && verificacion.data) {
    req.user = verificacion.data;
    next();
  } else {
    res.status(401).send("Token inválido");
  }
};