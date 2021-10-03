const db = require("../../conexao");

const detalhar = async (req, res) => {
  const usuarioID = req.usuario_id;

  try {
    const query = "select * from usuarios where id = $1";
    const { rows } = await db.query(query, [usuarioID]);

    const { senha, ...usuario } = rows[0];

    res.json(usuario);
  } catch (error) {
    res.status(400).json({ mensagem: error.message });
  }
};

module.exports = detalhar;
