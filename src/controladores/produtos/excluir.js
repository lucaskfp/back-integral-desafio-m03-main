const db = require("../../conexao");

const excluir = async (req, res) => {
  const usuarioID = req.usuario_id;
  const produtoID = req.params.id;

  try {
    const verificaAcesso = "select * from produtos where id = $1";
    const { rowCount, rows: resultadoAcesso } = await db.query(verificaAcesso, [
      produtoID,
    ]);

    if (rowCount === 0) {
      return res
        .status(404)
        .json({ mensagem: `Não existe produto para o ID ${produtoID}.` });
    }

    if (resultadoAcesso[0].usuario_id !== usuarioID) {
      return res.status(403).json({
        mensagem:
          "O usuário logado não tem permissão para acessar este produto.",
      });
    }

    const query = "delete from produtos where id = $1";
    const resultadoExclusao = await db.query(query, [produtoID]);

    if (resultadoExclusao.rowCount === 0) {
      return res
        .status(400)
        .json({ mensagem: "Não foi possível excluir o produto." });
    }

    res.status(204).json();
  } catch (error) {
    res.status(400).json({ mensagem: error.message });
  }
};

module.exports = excluir;
