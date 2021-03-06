const db = require("../../conexao");
const bcrypt = require("bcrypt");
const { schemaCadastroUsuario } = require("../../validacoes/schemas");

const cadastrar = async (req, res) => {
  const { nome, email, senha, nome_loja } = req.body;

  try {
    await schemaCadastroUsuario.validate(req.body);

    const consultaEmail = "select * from usuarios where email = $1";

    const resultadoEmail = await db.query(consultaEmail, [email]);

    if (resultadoEmail.rowCount > 0) {
      return res.status(400).json({
        mensagem: "Já existe usuário cadastrado com o e-mail informado.",
      });
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const query =
      "insert into usuarios (nome, email, senha, nome_loja) values ($1,$2,$3,$4)";

    const usuarioCadastrado = await db.query(query, [
      nome,
      email,
      senhaCriptografada,
      nome_loja,
    ]);

    if (usuarioCadastrado.rowCount === 0) {
      return res
        .status(400)
        .json({ mensagem: "Não foi possível cadastrar o usuário." });
    }

    return res.status(204).json();
  } catch (error) {
    return res.status(400).json({ mensagem: error.message });
  }
};

module.exports = cadastrar;
