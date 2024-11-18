require("dotenv").config();
const express = require('express');
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const router = express.Router();
const bodyParser = require('body-parser');
const Cliente = require('../models/Cliente');
const Barbeiro = require('../models/Barbeiro');
const Feedback = require('../models/Feedback');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const { Op } = require('sequelize');

const popularClienteLogado = require('../middlewares/popularClienteLogado');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const uploadDir = './uploads';

router.use(bodyParser.urlencoded({ extended: true }));

router.get("/novocliente", (req, res) =>{
     res.render("clientes/cadastracliente")
})

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, `upload_${Date.now()}_${file.originalname}`);
  }
});
const upload = multer({ storage });

router.post("/update", upload.single('image'), async (req, res) => {
  const clienteId = req.session.cliente.id_cliente;
  const { nome, sobrenome, email, telefone, cpf, dataNasc, senha } = req.body;

  let updateData = {
    nome,
    sobrenome,
    email,
    telefone,
    cpf,
    dataNasc,
  };

  if (req.file) {
    updateData.imagem = req.file.filename;
    console.log("Imagem carregada localmente:", req.file.filename);
  } else if (req.body.imagemUrl) {
    try {
      const imagemNome = `upload_${Date.now()}.png`;
      const imagemCaminho = path.join(uploadDir, imagemNome);

      const response = await axios({
        method: 'get',
        url: req.body.imagemUrl,
        responseType: 'stream'
      });

      const writer = fs.createWriteStream(imagemCaminho);
      response.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });

      updateData.imagem = imagemNome;
      console.log("Imagem recebida e salva via URL:", imagemNome);
    } catch (error) {
      console.error("Erro ao salvar a imagem via URL:", error);
      return res.status(500).send({ message: "Erro ao salvar a imagem" });
    }
  } else {
    console.log("Nenhuma imagem foi enviada.");
  }

  if (senha) {
    let criahash = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(senha, criahash);
    updateData.senha = hash;
    console.log("Senha atualizada.");
  } else {
    console.log("Senha não foi alterada.");
  }

  Cliente.update(updateData, { where: { id_cliente: clienteId } })
    .then(() => {
      console.log("Atualização bem-sucedida para o cliente ID:", clienteId);
      res.redirect("/"); 
    })
    .catch((err) => {
      console.log("Erro ao atualizar cliente:", err);
      res.status(500).send({ message: "Erro ao atualizar cliente" });
    });
});

router.use('/uploads', express.static('uploads'));

router.get('/feedback', (req, res) =>{
  res.render("clientes/feedbacks");
})

router.post('/feedbacks', async (req, res) => {
  const { comentario, avaliacao } = req.body;
  const cliente_id = req.session.cliente.id_cliente;

  try {
      const novoFeedback = await Feedback.create({
          cliente_id,
          comentario,
          avaliacao,
          data_feedback: new Date()
      });
      res.redirect("/")
  } catch (error) {
      console.error('Erro ao criar feedback:', error);
      res.status(500).json({ error: 'Erro ao salvar feedback' });
  }
});

router.post("/deletacliente", (req, res) => {
  let id_cliente = req.body.id_cliente;
  Cliente.destroy({
      where: {
          id_cliente:id_cliente
      }
  }).then(() => {
      res.redirect("/logincliente")
  })
})

router.get("/editarcliente/:id_cliente", (req, res) => {
  let idcli = req.params.id_cliente;
  Cliente.findByPk(idcli).then((cliente) => { 
    res.render("clientes/minhaconta", { cliente })
  })
})

router.post("/cliente/cadastro", (req, res) => {
  let nome = req.body.nome;
  let sobrenome = req.body.sobrenome;
  let login = req.body.email;

  Cliente.findOne({
    where: { email: login }
  }).then((cliente) => {
    if (cliente == undefined) {
      let senha = req.body.senha;
      let criahash = bcrypt.genSaltSync(10);
      let hash = bcrypt.hashSync(senha, criahash);
      Cliente.create({
        nome: nome,
        sobrenome:sobrenome,
        email: login,
        senha: hash
      }).then((clienteCriado) => {
        console.log("Logou")
        req.session.cliente = clienteCriado;
        const clienteId = req.session.cliente.id_cliente;
        const clienteName = req.session.cliente.nome;
        console.log("Cliente ID:", clienteId, clienteName);
        res.redirect("/")
      })
    } else {
      console.log("Deu ruim")
      res.redirect("/novocliente")
    }
  })
});

router.post("/cliente/login", (req, res) => {
  let email = req.body.email;
  let senha = req.body.senha;

  Promise.all([
      Barbeiro.findOne({ where: { email: email } }),
      Cliente.findOne({ where: { email: email } })
  ]).then(([barbeiro, cliente]) => {
      if (barbeiro) {
          let correta = bcrypt.compareSync(senha, barbeiro.senha);
          if (correta) {
              req.session.barbeiro = {
                  id_barber: barbeiro.dataValues.id_barber,
                  nome : barbeiro.nome,
                  email: barbeiro.email,
                  tipo: barbeiro.tipo,
              };
              req.session.save((err) => {
                  if (err) {
                      console.error(err);
                  } else {
                      req.session.barbeiro = barbeiro;
                      console.log("Sessão de barbeiro salva:", req.session.barbeiro);
                      res.redirect("/painelbarb");
                      console.log("Login de barbeiro deu certo");
                  }
              });
          } else {
              res.redirect("/logincliente");
          }
      } else if (cliente) {
          let correta = bcrypt.compareSync(senha, cliente.senha);
          if (correta) {
              req.session.cliente = {
                  id_cliente: cliente.dataValues.id_cliente,
                  nome: cliente.nome,
                  email: cliente.email,
                  imagem: cliente.imagem
              };
              req.session.save((err) => {
                  if (err) {
                      console.error(err);
                  } else {
                      console.log("Cliente ID:", req.session.cliente.id_cliente, req.session.cliente.nome);
                      res.redirect("/");
                      console.log("Login de cliente deu certo");
                  }
              });
          } else {
              res.redirect("/logincliente");
          }
      } else {
          res.redirect("/logincliente");
          console.log("Login deu errado");
      }
  }).catch((err) => {
      console.error("Erro ao buscar usuário:", err);
      res.redirect("/logincliente");
  });
});

router.get("/logincliente",(req,res)=>{
    res.render("clientes/logincliente")
})

router.get("/logout",(req,res)=>{
    req.session.destroy();
    res.redirect("/")
}) 

router.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  })
);

router.use(passport.initialize());
router.use(passport.session());

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const nome = profile.name.givenName;
        const sobrenome = profile.name.familyName;
        const email = profile.emails[0].value;
        const imagemUrl = profile.photos[0].value;

        let cliente = await Cliente.findOne({ where: { email } });

        if (!cliente) {
          const imagemNome = `google_${Date.now()}.png`;
          const imagemCaminho = path.join(uploadDir, imagemNome);

          const response = await axios({
            method: 'get',
            url: imagemUrl,
            responseType: 'stream'
          });

          const writer = fs.createWriteStream(imagemCaminho);
          response.data.pipe(writer);

          await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
          });

          cliente = await Cliente.create({
            nome,
            sobrenome,
            email,
            senha: null, 
            imagem: imagemNome,
          });
          console.log("Cliente cadastrado com Google:", cliente.nome);
        } else {
      
          if (cliente.imagem) {
            const imagemExistente = path.join(uploadDir, cliente.imagem);
            if (fs.existsSync(imagemExistente)) {
              console.log("Cliente já existe, imagem não alterada.");
              return done(null, cliente);
            }
          }

          const imagemNome = `google_${Date.now()}.png`;
          const imagemCaminho = path.join(uploadDir, imagemNome);

          const response = await axios({
            method: 'get',
            url: imagemUrl,
            responseType: 'stream'
          });

          const writer = fs.createWriteStream(imagemCaminho);
          response.data.pipe(writer);

          await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
          });

          cliente.imagem = imagemNome;
          await cliente.save();
          console.log("Imagem atualizada para o cliente:", cliente.nome);
        }

        done(null, cliente);
      } catch (error) {
        console.error("Erro no cadastro ou login com Google:", error);
        done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"], prompt: "select_account" })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    req.session.cliente = req.user; 
    req.session.isGoogleLogin = true;
    res.redirect("/"); 
  }
);

router.get("/get-login-status", (req, res) => {
  res.json({ isGoogleLogin: req.session.isGoogleLogin || false });
});

module.exports = router;