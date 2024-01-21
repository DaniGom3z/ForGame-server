const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/dbConfig.js");

class AdministradorModel {
  static async crearUsuario(nombre, email, contraseña) {
    const connection = await db.getConnection();
    try {
      const saltRounds = 10;
      const hash = await bcrypt.hash(contraseña, saltRounds);

      await connection.query(
        "INSERT INTO login (nombre, email, contraseña) VALUES (?, ?, ?)",
        [nombre, email, hash]
      );

      return { mensaje: "Usuario creado exitosamente" };
    } catch (error) {
      console.error(error);
    }
  }

  static async iniciarSesion(email, contraseña) {
    try {
      const [rows] = await db.query("SELECT * FROM login WHERE email = ?", [email]);

      if (rows.length === 0) {
        throw new Error("El usuario no existe");
      }

      const usuario = rows[0];

      const contraseñaValida = await bcrypt.compare(contraseña, usuario.contraseña);

      if (!contraseñaValida) {
        throw new Error("Credenciales incorrectas");
      }

      const token = jwt.sign(
        {
          id_user: usuario.id_user,
          esAdministrador: true,
          email: usuario.email,
        },
        process.env.JWT_SECRET
      );

      return { mensaje: "Inicio de sesión exitoso", token };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async cerrarSesion(token) {
    if (!token) {
      throw new Error("Acceso no autorizado");
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const nuevoToken = jwt.sign(
        {
          id_user: decoded.id_user,
          esAdministrador: true,
          email: decoded.email,
        },
        process.env.JWT_SECRET,
        { expiresIn: 10 }
      );

      return { mensaje: "Cierre de sesión exitoso", token: nuevoToken };
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = AdministradorModel;
