const { verificarToken } = require("@damianegreco/hashpass");
const { TOKEN_SECRET } = process.env;

module.exports = function middleware(req, res, next) {
  const auth = req.headers.authorization;

  if (!auth) {
    return res.status(401).send("Sin token");
  }

  // acepta "Bearer xxx"
  const token = auth.startsWith("Bearer ")
    ? auth.split(" ")[1]
    : auth;

  const verificacion = verificarToken(token, TOKEN_SECRET);

  if (verificacion?.data) {
    req.user = verificacion.data;
    next();
  } else {
    res.status(401).send("Token inválido");
  }
};