const db = require("../../conexao");
const bcrypt = require("bcrypt");
const { schemaCadastroUsuario } = require("../../validacoes/schemas");

const atualizar = async (req, res) => {
  const { nome, email, senha, nome_loja } = req.body;
  const usuarioID = req.usuario_id;

  try {
    await schemaCadastroUsuario.validate(req.body);

    const consultaEmail = "select * from usuarios where email = $1";

    const resultadoEmail = await db.query(consultaEmail, [email]);

    const usuario = resultadoEmail.rows[0];

    if (usuario && usuario.id !== usuarioID) {
      throw {
        mensagem:
          "O e-mail informado já está sendo utilizado por outro usuário.",
      };
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const query =
      "update usuarios set nome = $1, email = $2, senha = $3, nome_loja = $4 where id = $5";

    await db.query(query, [
      nome,
      email,
      senhaCriptografada,
      nome_loja,
      usuarioID,
    ]);

    return res.status(200).json("Atualizaco com sucesso.");
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

module.exports = atualizar;
