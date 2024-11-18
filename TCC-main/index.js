const express = require('express');
const app = express();
const conexao = require('./src/config/db');
const session = require('express-session');
const Cliente = require('./src/models/Cliente')
const Plano = require('./src/models/Planos');
const PORT = 3000; 

app.use(session({
    secret:"qualquercoisa",
    resave: false,
    saveUninitialized:false,
  //  cookie:{maxAge:20000}
}))

const ControleProdutos = require('./src/controllers/controleProdutos');
const ControleCliente = require('./src/controllers/controleCliente');
const ControlePlanos = require('./src/controllers/controlePlanos');
const ControleTarefas = require('./src/controllers/controleTarefas');
const ControleServico = require('./src/controllers/controleServico');
const ControleBarbeiro = require('./src/controllers/controleBarb');
const ControleAgendamento = require('./src/controllers/controleAgendamento');
const Servico = require('./src/models/Servicos');
const Agendamentos = require('./src/models/Agendamentos');

app.use("/", ControleCliente)
app.use("/", ControleAgendamento)
app.use("/", ControleProdutos)
app.use("/", ControlePlanos)
app.use("/", ControleBarbeiro)
app.use("/", ControleTarefas)
app.use("/", ControleServico)

conexao.authenticate().then(()=>{
    console.log("CONECTADO COM O BANCO");
}).catch((erroMsg)=>{
    console.log(erroMsg);
})

app.set("view engine","ejs");
app.set('views', './src/views');
app.use('/css', express.static('css'));
app.use('/img', express.static('img'));

app.get("/", (req, res) => {
  if (!req.session.cliente) {
    Plano.findAll().then(planos =>{
    res.render('novo1', {planos});
    });
  } else {
    Cliente.findByPk(req.session.cliente.id_cliente).then(clienteAtualizado => {
      if (clienteAtualizado) {
        Plano.findAll().then(planos =>{
        res.render('novo', { cliente: clienteAtualizado, planos });
        })
      } else {
        res.redirect('/');
      }
    });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
