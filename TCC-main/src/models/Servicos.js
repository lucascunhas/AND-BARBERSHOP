const Sequelize = require("sequelize");
const conexao = require("../config/db");

const Servico = conexao.define('servicos', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    nome: {
      type: Sequelize.STRING,
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
    tempo: {
        type: Sequelize.INTEGER,  // Armazena o tempo do serviço em minutos, por exemplo
        allowNull: false
    }
});

Servico.sync();
module.exports = Servico;
