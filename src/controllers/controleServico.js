const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const Servico = require('../models/Servicos')
const Barbeiro = require('../models/Barbeiro');
const adminAut = require('../middlewares/adminAutoriz1');
const barbAut = require('../middlewares/BarbeiroeadminLogado');
const db = require('../config/db');
const { default: slugify } = require('slugify');

router.use(bodyParser.urlencoded({extended:true}));

router.use((req, res, next) => {
  if (req.session && req.session.barbeiro) {
      res.locals.barbeiro = req.session.barbeiro;
  } else {
      res.locals.barbeiro = null; 
  }
  next(); 
});

router.get('/planos', (req, res) =>{
  res.render("planos/listaPlanos");
})

router.get('/verservicos',adminAut, barbAut, async (req, res) => {
  try {
    const servicos = await db.query('SELECT * FROM servicos');
    const servico = await Servico.findAll();
    res.render("servico/verServicos", { servicos: servico, servicosDB: servicos.rows });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
});

router.post("/deletaservico", (req, res) => {
  let id_servico = req.body.id;
  Servico.destroy({
      where: {
          id: id_servico
      }
  }).then(() => {
      res.redirect("/verservicos")
  })
})

router.get("/editarservico/:id", adminAut, (req, res) => {
  let idserv = req.params.id;
  Servico.findByPk(idserv).then((servico) => { 
    res.render("servico/editarServico", { servico })
  })
})

router.post("/updateservico",(req,res)=>{
  let id = req.body.id;
  let nome = req.body.nome;
  let descricao = req.body.descricao;
  let preco = req.body.preco;
  let tempo = req.body.tempo
  Servico.update({
      nome:nome,
      descricao:descricao,
      preco:preco,
      tempo:tempo
  },
  {
  where:{
          id:id
        }
}).then(()=>{
      res.redirect("/verservicos")
})
})

router.post('/cadservico', async (req, res) => {
  try {
    const { nome, descricao, preco, tempo } = req.body;
    const servico = await Servico.create({ nome, descricao, preco, tempo });  
    req.session.servico = servico;
    res.render("servico/cadservico");
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao cadastrar Serviço');
  }
});


router.get("/cadservicos", adminAut, barbAut, (req,res)=>{
  Barbeiro.findAll().then((barbeiros) => {
    res.render("servico/cadservico", {barbeiros});
  })
})

module.exports = router;