const yup = require("./yupConfiguracao");

const schemaCadastroUsuario = yup.object().shape({
  nome: yup.string().required(),
  email: yup.string().email().required(),
  senha: yup.string().required(),
  nome_loja: yup.string().required(),
});

const schemaLoginUsuario = yup.object().shape({
  email: yup.string().email().required(),
  senha: yup.string().required(),
});

const schemaCadastroProduto = yup.object().shape({
  nome: yup.string().required(),
  quantidade: yup.number().positive().integer().required(),
  preco: yup.number().positive().required(),
  descricao: yup.string().required(),
});

module.exports = {
  schemaCadastroUsuario,
  schemaLoginUsuario,
  schemaCadastroProduto,
};
