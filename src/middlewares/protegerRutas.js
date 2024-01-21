const jwt = require("jsonwebtoken");

const protegerRutas = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res
      .status(401)
      .json({ mensaje: "Acceso no autorizado, token no proporcionado" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"], // Removed unnecessary 'verifyOptions' wrapper
      format: "compact",
    });
    req.user = decoded;
    req.id_user = req.user.id_user;

    next();
  } catch (error) {
    res.status(403).json({ mensaje: "Token inválido", error: error.message });
  }
};

module.exports = protegerRutas;
