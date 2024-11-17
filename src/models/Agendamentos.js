const Sequelize = require("sequelize");
const conexao = require("../config/db");
const Cliente = require("./Cliente");
const Servico = require("./Servicos");
const Barbeiro = require("./Barbeiro");

const Agendamentos = conexao.define('agendamentos', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  cliente_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  servico_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  barbeiro_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  status: {
    type: Sequelize.TINYINT,
    allowNull: false
  }, 
  data: {
    type: Sequelize.DATEONLY,
    allowNull: false
  },
  hora: {
    type: Sequelize.TIME,
    allowNull: false
  },
  hora_fim: {  
    type: Sequelize.TIME,
    allowNull: false
  }
});

Cliente.hasMany(Agendamentos, {
    foreignKey: "cliente_id",
});
  
Agendamentos.belongsTo(Cliente, {
    foreignKey: "cliente_id",
    as: "cliente",
});

Servico.hasMany(Agendamentos, {
  foreignKey: "servico_id",
});

Agendamentos.belongsTo(Servico, {
  foreignKey: "servico_id",
  as: "servico",
});

Barbeiro.hasMany(Agendamentos, {
  foreignKey: "barbeiro_id",
});

Agendamentos.belongsTo(Barbeiro, {
  foreignKey: "barbeiro_id",
  as: "barbeiro",
});


Agendamentos.sync();
module.exports = Agendamentos;
