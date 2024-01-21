const express = require("express");
const protegerRutas = require("../middlewares/protegerRutas.js");
const admin = require("../controllers/administradorController.js");
const videojuego = require("../controllers/videojuegoController.js");

const administradorRoute = express.Router();

administradorRoute.post("/registro", admin.crearUsuario);
administradorRoute.post("/iniciar", admin.iniciarSesion);
administradorRoute.post("/popular/game", protegerRutas, videojuego.editarPopular);
administradorRoute.post("/cerrarSesion", protegerRutas, admin.cerrarSesion);

module.exports = administradorRoute;
