const express = require("express");
const userRoute = express.Router();
const videojuego = require("../controllers/videojuegoController.js");

userRoute.get("/popular", videojuego.obtenerPopular);

module.exports = userRoute;
