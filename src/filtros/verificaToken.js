const jtw = require("jsonwebtoken");

const verificaToken = async (req, res, next) => {
  let token = req.headers.authorization;

  const errorMessage =
    "Para acessar este recurso um token de autenticação válido deve ser enviado.";

  if (!token) {
    return res.status(401).json({ mensagem: errorMessage });
  }

  try {
    token = token.replace("Bearer", "").trim();
    const { id } = await jtw.verify(token, process.env.TOKEN_SECRET);
    req.usuario_id = id;
    next();
  } catch (error) {
    res.status(401).json({ mensagem: errorMessage });
  }
};

module.exports = verificaToken;
