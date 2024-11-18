const Sequelize = require('sequelize');
const Barbeiro = require('../models/Barbeiro');
const conexao = require("../config/db");
const BarbeiroHorario = conexao.define('barbeiro_horarios', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    barbeiro_id: {
      type: Sequelize.INTEGER,
      references: {
        model: Barbeiro,
        key: 'id_barber'
      }
    },
    dia_semana: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    hora_inicio: {
      type: Sequelize.TIME,
      allowNull: false
    },
    hora_fim: {
      type: Sequelize.TIME,
      allowNull: false
    }
  });

BarbeiroHorario.sync();
module.exports = BarbeiroHorario;