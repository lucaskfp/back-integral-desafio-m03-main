const db = require("../../conexao");
const bcrypt = require("bcrypt");
const jtw = require("jsonwebtoken");
const { schemaLoginUsuario } = require("../../validacoes/schemas");

const login = async (req, res) => {
  const { email, senha } = req.body;

  try {
    await schemaLoginUsuario.validate(req.body);

    const consultaEmail = "select * from usuarios where email = $1";

    const resultadoEmail = await db.query(consultaEmail, [email]);

    if (resultadoEmail.rowCount === 0) {
      return res.status(404).json({
        mensagem: "Usuário não encontrado.",
      });
    }

    const usuario = resultadoEmail.rows[0];

    const senhaVerificada = await bcrypt.compare(senha, usuario.senha);

    if (!senhaVerificada) {
      return res
        .status(400)
        .json({ mensagem: "Usuário e/ou senha inválido(s)." });
    }

    const token = jtw.sign({ id: usuario.id }, process.env.TOKEN_SECRET);

    return res.status(201).json({ token });
  } catch (error) {
    return res.status(400).json({ mensagem: error.message });
  }
};

module.exports = login;
