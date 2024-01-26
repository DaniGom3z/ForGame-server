// longPollingRoutes.js

const express = require("express");
const longPollingController = require("../controllers/longPollingController");

const router = express.Router();

router.post("/conectados", async (req, res) => {
  try {
    await longPollingController.notificarUsuariosConectados();
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error al notificar usuarios conectados:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

router.get("/conexion", longPollingController.handleConexion);

module.exports = router;
