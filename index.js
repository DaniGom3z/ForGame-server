require("dotenv").config();
const express = require("express");
const cors = require("cors");
const administradorRouter = require("./src/routes/adminRoute.js");
const userRouter = require("./src/routes/userRouter.js");
const conectados = require("./src/routes/longpollingRoute.js");
const logger = require("morgan");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);
app.use(cors());

const lastMessages = [];

io.on("connection", (socket) => {
  console.log('Conexión establecida con el servidor');

  // Manejar unirse a una sala
  socket.on("joinRoom", (room) => {
    socket.join(room);
    console.log(`Cliente ${socket.id} se unió a la sala: ${room}`);
    io.to(room).emit("recentMessages", lastMessages.filter(msg => msg.room === room));
  });

  // Manejar mensajes en una sala específica
  socket.on("message", (data) => {
    const newMessage = {
      body: data.body,
      from: socket.id.slice(6),
      room: data.room,
    };

    lastMessages.push(newMessage);
    if (lastMessages.length > 10) {
      lastMessages.shift();
    }

    io.to(data.room).emit("message", newMessage);
  });

  // Manejar salir de una sala
  socket.on("leaveRoom", (room) => {
    socket.leave(room);
    console.log(`Cliente ${socket.id} salió de la sala: ${room}`);
  });
});

app.use(express.json());
app.use(administradorRouter);
app.use(userRouter);
app.use(conectados);
app.use(logger("dev"));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Servidor escuchando en ${PORT}`);
});
