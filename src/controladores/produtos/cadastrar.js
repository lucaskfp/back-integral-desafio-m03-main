const db = require("../../conexao");

const cadastrar = async (req, res) => {
  const { nome, quantidade, categoria, preco, descricao, imagem } = req.body;
  const usuarioID = req.usuario_id;

  const camposObrigatorios = verificaCampos(nome, quantidade, preco, descricao);

  if (camposObrigatorios) {
    return res.status(400).json(camposObrigatorios);
  }

  try {
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
    res.status(400).json(error);
  }
};

function verificaCampos(nome, quantidade, preco, descricao) {
  if (!nome) return { mensagem: "O campo nome é obrigatório." };
  if (!quantidade || quantidade <= 0)
    return { mensagem: "O campo quantidade precisa ser maior que zero." };
  if (!preco) return { mensagem: "O campo preço é obrigatório." };
  if (!descricao) return { mensagem: "O campo descrição é obrigatório." };

  return false;
}

module.exports = cadastrar;
