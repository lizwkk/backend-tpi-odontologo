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
app.use('/archivos', express.static(path.join(__dirname, 'src/archivos')));

// Según la imagen de tu amiga, ella usa una carpeta "routes" dentro de "src"
const turnosRoutes = require('./src/routes/turnos.routes');
const usuariosRoutes = require('./src/routes/usuarios.routes');

app.use("/api/turnos", turnosRoutes);
app.use("/api/usuarios", usuariosRoutes);

const server = app.listen(puerto, (error) => {
  if (error) {
    console.error(error);
    process.exit(1);
  }
  console.log(`Servidor corriendo en el puerto ${puerto}`);
});

server.timeout = 300000;