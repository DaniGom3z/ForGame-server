require("dotenv").config();
const express = require("express");
const cors = require("cors")
const administradorRouter = require("./src/routes/adminRoute.js");
const userRouter = require("./src/routes/userRouter.js");
const logger = require("morgan");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);
app.use(cors());

io.on("connection", (socket) => {
  console.log("Cliente conectado");

  socket.on("message", (body) => {
    socket.broadcast.emit('message',{
      body,
      from: socket.id.slice(6)
    })
  });


});

app.use(express.json());
app.use(administradorRouter);
app.use(userRouter);
app.use(logger("dev"));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Servidor escuchando en ${PORT}`);
});

let usuariosConectados = [];

function notificarUsuariosConectados() {
  for (const res of usuariosConectados) {
    res.json({
      totalUsuarios: usuariosConectados.length,
    });
  }
}

app.post("/conectados", (req, res) => {
  notificarUsuariosConectados();
  res.status(200).json({ success: true });
});

app.get("/conexion", (req, res) => {
  usuariosConectados.push(res);

  req.on("close", () => {
    const index = usuariosConectados.indexOf(res);
    if (index !== -1) {
      usuariosConectados.splice(index, 1);
    }
  });
});

// Short-polling para popular
// long-polling para conectados
