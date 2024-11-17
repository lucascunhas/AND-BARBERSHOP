const Sequelize = require("sequelize");
const conexao = require("../config/db");
const Plano = require('../models/Planos');
const Cliente = conexao.define('cliente', {
    id_cliente: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: true
    },
    nome: {
      type: Sequelize.STRING,
      allowNull: true
    },
    sobrenome: {
      type: Sequelize.STRING,
      allowNull: true
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false
    },
    cpf: {
      type: Sequelize.STRING,
      allowNull: true
    },
    telefone: {
      type: Sequelize.STRING,
      allowNull: true
    },
    dataNasc: {
      type: Sequelize.DATEONLY,
      allowNull: true
    },
    senha: {
      type: Sequelize.STRING,
      allowNull: true
    },
    imagem: {
      type: Sequelize.STRING,
      allowNull: true
    },
    plano_id: {
      type: Sequelize.INTEGER,
      defaultvalue: 0,
      references: {
        model: Plano, // Nome da tabela referenciada
        key: 'id_plano'
      }
    }
});
Cliente.sync();
module.exports = Cliente