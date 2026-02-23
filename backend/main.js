const router = require("express").Router();
const api = require("./API/main");  // ✅ acá está todo lo de la API

router.use("/", api);

module.exports = router;