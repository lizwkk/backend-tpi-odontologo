require("dotenv").config();
const express = require("express");
const cors = require("cors");

const apiRouter = require("./main"); // <- importa el router principal

const app = express();

app.use(cors());
app.use(express.json());

// health check
app.get("/", (req, res) => res.send("Backend OK"));

app.use("/api", apiRouter);

app.listen(process.env.PUERTO, () => {
  console.log("Escuchando en puerto " + process.env.PUERTO);
});