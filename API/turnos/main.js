const router = require("express").Router();

router.get("/", (req, res) => {
  res.send("Turnos OK");
});

module.exports = router;