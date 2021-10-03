const db = require("../../conexao");
const bcrypt = require("bcrypt");
const jtw = require("jsonwebtoken");
const secret = require("../../tokenSecret");

const login = async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha)
    return res
      .status(400)
      .json({ mensagem: "O campo email e senha são obrigatórios." });

  try {
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

    const token = jtw.sign({ id: usuario.id }, secret);

    return res.status(201).json({ token });
  } catch (error) {
    return res.status(400).json({ mensagem: error.message });
  }
};

module.exports = login;
