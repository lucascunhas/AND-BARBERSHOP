const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const Cliente = require('../models/Cliente');
const Plano = require('../models/Planos');
const {MercadoPagoConfig, Payment} = require('mercadopago');
const adminAut = require('../middlewares/adminAutoriz');
require('dotenv').config();

const client = new MercadoPagoConfig({
  accessToken: process.env.accessToken,
  options: {
      timeout: 5000
  }
});

const payment = new Payment(client);

router.use(bodyParser.urlencoded({extended:true}));

router.get("/planos", adminAut, (req,res)=>{
    Cliente.findAll().then(clientes => {
      Plano.findAll().then(planos =>{
        res.render("planos/listaPlanos", { cliente: req.session.cliente, clientes, planos });
      });
      });
})

router.post("/comprar/:id_plano", async (req, res) => {
  const planoId = req.params.id;
  try {
    const plano = await Plano.findByPk(planoId);

    if (!plano) {
        return res.status(404).send("Plano não encontrado");
    }

    const preference = {
        items: [
            {
                title: plano.nome_plano,
                unit_price: parseFloat(plano.preco),
                quantity: 1,
            }
        ],
        back_urls: {
            success: "http://localhost:3000/sucesso", 
            failure: "http://localhost:3000/falha",
            pending: "http://localhost:3000/pendente" 
        },
        auto_return: 'approved',  
    };

      const response = await payment.create({
          body: {
              transaction_amount: preference.items[0].unit_price,
              description: preference.items[0].title,
              payment_method_id: 'pix', 
              payer: {
                email: req.session.cliente ? req.session.cliente.email : "emaildeteste@example.com",
            }
          }
      });

      const initPoint = response.body.init_point; 

      res.redirect(initPoint);
  } catch (error) {
      console.error('Erro ao criar a preferência de pagamento:', error);
      res.status(500).send('Erro ao processar pagamento.');
  }
});

router.get("/sucesso", (req, res) => {
  res.send("Pagamento realizado com sucesso!");
});

router.get("/falha", (req, res) => {
  res.send("O pagamento falhou. Tente novamente.");
});

router.get("/pendente", (req, res) => {
  res.send("Seu pagamento está pendente de aprovação.");
});

router.post("/plano/cadastro", (req, res) => {
  const { nome_plano, descricao, preco} = req.body;
  Plano.create({
    nome_plano,
    descricao,
    preco
  })
  .then((planoCriado) => {
    console.log("Plano criado com sucesso!");
    res.redirect("/planos");
  })
  .catch((error) => {
    console.log("Erro ao criar plano:", error);
    res.redirect("/novoplano");
  });
});

router.get("/novoplano", (req,res)=>{
      res.render("planos/cadplano");
})

module.exports = router;