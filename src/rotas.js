const express = require("express");
const rotas = express();
const usuarios = require("./controladores/usuarios");
const produtos = require("./controladores/produtos");
const verificaToken = require("./filtros/verificaToken");

// Rotas usúarios
rotas.post("/usuario", usuarios.cadastrar);

rotas.post("/login", usuarios.login);

rotas.use(verificaToken);

rotas.get("/usuario", usuarios.detalhar);

rotas.put("/usuario", usuarios.atualizar);

// Rotas produtos
rotas.get("/produtos", produtos.listar);

rotas.get("/produtos/:id", produtos.detalhar);

rotas.post("/produtos/", produtos.cadastrar);

rotas.put("/produtos/:id", produtos.atualizar);

rotas.delete("/produtos/:id", produtos.excluir);

module.exports = rotas;
