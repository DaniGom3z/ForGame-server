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
  console.log("Cliente conectado");
  io.emit("recentMessages", lastMessages);

  socket.on("message", (body) => {
    const newMessage = {
      body,
      from: socket.id.slice(6),
    };

    lastMessages.push(newMessage);
    if (lastMessages.length > 10) {
      lastMessages.shift(); 
    }

    io.emit("message", newMessage);
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
