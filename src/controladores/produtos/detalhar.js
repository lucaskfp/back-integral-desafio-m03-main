const db = require("../../conexao");

const detalhar = async (req, res) => {
  const usuarioID = req.usuario_id;
  const { id } = req.params;

  try {
    const query = "select * from produtos where id = $1";

    const { rows: produto } = await db.query(query, [id]);

    if (produto.length === 0) {
      return res
        .status(404)
        .json({ mensagem: `Não existe produto cadastrado com ID ${id}.` });
    }

    if (produto[0].usuario_id !== usuarioID) {
      return res.status(403).json({
        mensagem:
          "O usuário logado não tem permissão para acessar este produto.",
      });
    }

    res.json(produto);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

module.exports = detalhar;
