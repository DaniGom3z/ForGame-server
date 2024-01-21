let popular = "";

const obtenerPopular = (req, res) => {
  res.json({ popular });
};

const editarPopular = (req, res) => {
  popular = req.body.game;
  res.status(200).send("Actualización exitosa");
};

module.exports = { obtenerPopular, editarPopular };
