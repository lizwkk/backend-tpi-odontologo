const router = require("express").Router();
const api = require("./API/main"); // todo lo de /api adentro de /API

router.use("/", api);

module.exports = router;