const Sequelize = require("sequelize");
const conexao = require("../config/db");
const Cliente = require("./Cliente");

const Plano = conexao.define('plano', {
  id_plano: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nome_plano: {
    type: Sequelize.STRING(255),
    allowNull: false
  },
  descricao: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  preco: {
    type: Sequelize.CHAR(10),
    allowNull: false
  },
  /*cliente_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
  data_inicio: {
    type: Sequelize.DATEONLY,
    allowNull: false
  },
  data_fim: {
    type: Sequelize.DATEONLY,
    allowNull: false
  },
  status: {
    type: Sequelize.ENUM('ativo', 'inativo'),
    allowNull: false
  }*/
});

// Definindo relação com a tabela Cliente
/*Cliente.hasMany(Plano, {
  foreignKey: "cliente_id",
});

Plano.belongsTo(Cliente, {
  foreignKey: "cliente_id",
  as: "cliente",
});*/

Plano.sync();
module.exports = Plano;
