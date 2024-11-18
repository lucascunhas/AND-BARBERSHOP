const Sequelize = require('sequelize');
const conexao = new Sequelize('barb353','root','',{
    host: 'localhost',
    dialect: 'mysql',
    define: {
        timestamps: false,
        freezeTableName: true
    }
})

module.exports = conexao;