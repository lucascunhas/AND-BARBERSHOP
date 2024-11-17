const Sequelize = require('sequelize');
const conexao = require('../config/db');
const Tarefa = require('./Tarefas');
const Barbeiro = require('./Barbeiro');

const TarefaBarbeiro = conexao.define('TarefaBarbeiro', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_barbeiro: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'barbeiro', 
            key: 'id_barber' 
        }
    },
    id_tarefa: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'tarefa', 
            key: 'id' 
        }
    }
});

TarefaBarbeiro.belongsTo(Tarefa, { foreignKey: 'id_tarefa' });
TarefaBarbeiro.belongsTo(Barbeiro, { foreignKey: 'id_barbeiro' });

Tarefa.hasMany(TarefaBarbeiro, { foreignKey: 'id_tarefa' });
Barbeiro.hasMany(TarefaBarbeiro, { foreignKey: 'id_barbeiro' });

TarefaBarbeiro.sync();
module.exports = TarefaBarbeiro;
