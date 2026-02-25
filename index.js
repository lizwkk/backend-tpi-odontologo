require("dotenv").config();
const express = require("express");
const cors = require("cors");

const apiRouter = require("./API/main"); // ✅ ESTE ES EL BUENO

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("Backend OK"));

app.use("/api", apiRouter);

app.listen(process.env.PUERTO, () => {
  console.log("Escuchando en puerto " + process.env.PUERTO);
});