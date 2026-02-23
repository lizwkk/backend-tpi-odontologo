const router = require("express").Router();

router.get("/", (req, res) => {
  res.send("Profesionales OK");
});

module.exports = router;