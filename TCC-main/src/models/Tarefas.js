const Sequelize = require('sequelize');
const conexao = require('../config/db');

const Tarefa = conexao.define('tarefa', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome: {
    type: Sequelize.STRING,
    allowNull: false
  },
  descricao: {
    type: Sequelize.TEXT,
    allowNull: true
  },
  dataInicio: {
    type: Sequelize.DATE,
    allowNull: false
  },
  dataTermino: {
    type: Sequelize.DATE,
    allowNull: false
  },
  status: {
    type: Sequelize.ENUM('pendente', 'concluída', 'cancelada'),
    defaultValue: 'pendente'
  },
  paraTodos: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  }
});

Tarefa.sync();
module.exports = Tarefa;
