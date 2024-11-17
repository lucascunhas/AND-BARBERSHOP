const Sequelize = require("sequelize");
const conexao = require("../config/db");
const Cliente = require("./Cliente");

const Feedback = conexao.define('feedback', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  cliente_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  comentario: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  data_feedback: {
    type: Sequelize.DATE,
    allowNull: false
  },
  avaliacao: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  }
});

Cliente.hasMany(Feedback, {
  foreignKey: "cliente_id",
});

Feedback.belongsTo(Cliente, {
  foreignKey: "cliente_id",
  as: "cliente",
});

Feedback.sync();
module.exports = Feedback;
