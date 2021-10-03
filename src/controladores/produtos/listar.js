const db = require("../../conexao");

const listar = async (req, res) => {
  const usuarioID = req.usuario_id;

  try {
    const query = "select * from produtos where usuario_id = $1";

    const produtos = await db.query(query, [usuarioID]);

    res.json(produtos.rows);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

module.exports = listar;
