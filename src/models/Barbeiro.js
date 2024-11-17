const Sequelize = require('sequelize');
const conexao = require('../config/db');

const Barbeiro = conexao.define('barbeiro', {
  id_barber: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome: {
    type: Sequelize.STRING,
    allowNull: false
  },
  sobrenome: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false
  },
  senha: {
    type: Sequelize.STRING,
    allowNull: false
  },
  imagem: {
    type: Sequelize.STRING,
    allowNull: true
  },
  tipo: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
});

Barbeiro.sync()
module.exports = Barbeiro;
