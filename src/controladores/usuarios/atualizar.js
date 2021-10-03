const db = require("../../conexao");
const bcrypt = require("bcrypt");

const atualizar = async (req, res) => {
  const { nome, email, senha, nome_loja } = req.body;
  const usuarioID = req.usuario_id;

  const camposObrigatorios = verificaCampos(nome, email, senha, nome_loja);

  if (camposObrigatorios) {
    return res.status(400).json(camposObrigatorios);
  }

  try {
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

    const resultadoAtualizacao = await db.query(query, [
      nome,
      email,
      senhaCriptografada,
      nome_loja,
      usuarioID,
    ]);

    return res.json(resultadoAtualizacao);
  } catch (error) {
    return res.status(400).json(error);
  }
};

function verificaCampos(nome, email, senha, nome_loja) {
  if (!nome) return { mensagem: "O campo nome é obrigatório." };
  if (!email) return { mensagem: "O campo email é obrigatório." };
  if (!senha) return { mensagem: "O campo senha é obrigatório." };
  if (!nome_loja) return { mensagem: "O campo nome da loja é obrigatório." };

  return false;
}

module.exports = atualizar;
