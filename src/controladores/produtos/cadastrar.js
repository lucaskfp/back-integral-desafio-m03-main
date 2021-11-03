const db = require("../../conexao");

const { schemaCadastroProduto } = require("../../validacoes/schemas");

const cadastrar = async (req, res) => {
  const { nome, quantidade, categoria, preco, descricao, imagem } = req.body;
  const usuarioID = req.usuario_id;

  try {
    await schemaCadastroProduto.validate(req.body);

    const query = `
      insert into produtos (usuario_id, nome, quantidade, categoria, preco, descricao, imagem)
      values ($1,$2,$3,$4,$5,$6,$7)
      `;
    const resultado = await db.query(query, [
      usuarioID,
      nome,
      quantidade,
      categoria || null,
      preco,
      descricao,
      imagem || null,
    ]);

    if (resultado.rowCount === 0) {
      return res
        .status(400)
        .json({ mensagem: "Não foi possível cadastrar o produto." });
    }

    return res.status(201).json();
  } catch (error) {
    res.status(400).json(error.message);
  }
};

module.exports = cadastrar;
