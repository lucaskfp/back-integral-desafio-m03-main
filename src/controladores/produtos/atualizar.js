const db = require("../../conexao");

const { schemaCadastroProduto } = require("../../validacoes/schemas");

const atualizar = async (req, res) => {
  const { nome, quantidade, categoria, preco, descricao, imagem } = req.body;
  const usuarioID = req.usuario_id;
  const produtoID = req.params.id;

  try {
    await schemaCadastroProduto.validate(req.body);

    const verificaAcesso = "select * from produtos where id = $1";
    const { rowCount, rows: resultadoAcesso } = await db.query(verificaAcesso, [
      produtoID,
    ]);

    if (rowCount === 0) {
      return res.status(404).json({ mensagem: `Produto não encontrado.` });
    }

    if (resultadoAcesso[0].usuario_id !== usuarioID) {
      return res.status(403).json({
        mensagem:
          "O usuário logado não tem permissão para acessar este produto.",
      });
    }

    const query = `
      update produtos set nome = $1, quantidade = $2, categoria = $3, preco = $4, descricao = $5, imagem = $6 
      where id = $7
      `;
    const resultado = await db.query(query, [
      nome,
      quantidade,
      categoria || null,
      preco,
      descricao,
      imagem || null,
      produtoID,
    ]);

    if (resultado.rowCount === 0) {
      return res
        .status(400)
        .json({ mensagem: "Não foi possível atualizar o produto." });
    }

    return res.status(201).json();
  } catch (error) {
    res.status(400).json(error.message);
  }
};

module.exports = atualizar;
