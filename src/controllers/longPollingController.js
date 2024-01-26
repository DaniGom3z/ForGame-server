const usuariosConectados = [];

const notificarUsuariosConectados = () => {
  const mensaje = {
    totalUsuarios: usuariosConectados.length,
  };
  usuariosConectados.forEach((res) => {
    res.write(JSON.stringify(mensaje));  
  });

  usuariosConectados.forEach((res) => {
    res.end();
  });
};

function handleConexion(req, res) {
  usuariosConectados.push(res);

  req.on("close", () => {
    const index = usuariosConectados.indexOf(res);
    if (index !== -1) {
      usuariosConectados.splice(index, 1);
      notificarUsuariosConectados(); 
    }
  });
}

module.exports = {
  notificarUsuariosConectados,
  handleConexion,
};
