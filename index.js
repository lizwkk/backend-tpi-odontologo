require('dotenv').config();
const path = require('path');
const cors = require("cors");
const express = require('express');

const app = express();
const puerto = process.env.PUERTO || 3000;

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());


app.use('/archivos', express.static(path.join(__dirname, 'archivos')));


const apiRouter = require('./API/main'); 
app.use("/api", apiRouter);

const server = app.listen(puerto, (error) => {
  if (error) {
    console.error(error);
    process.exit(1);
  }
  console.log(`Servidor corriendo en el puerto ${puerto}`);
});

server.timeout = 300000;