const express = require('express');
const router = express.Router();
const Barbeiro = require('../models/Barbeiro');
const BarbeiroHorario = require('../models/BarbeiroHorario');
const barbAut = require('../middlewares/BarbeiroeadminLogado');
const Feedback = require('../models/Feedback');
const Cliente = require('../models/Cliente');
const TarefaBarbeiro = require('../models/TarefaBarbeiro');
const db = require('../config/db');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const multer = require('multer');
const fs = require('fs');
const path = require('path');
const uploadDir = './uploads';

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

router.post('/barbeiro/editar/:id', upload.single('image'), async (req, res) => {
  try {
    const { nome, sobrenome, email, senha, tipo } = req.body;

    const barbeiro = await Barbeiro.findByPk(req.params.id);
    if (!barbeiro) {
      return res.status(404).send('Barbeiro não encontrado');
    }

    barbeiro.nome = nome;
    barbeiro.sobrenome = sobrenome;
    barbeiro.email = email;
    if (senha) {
      const salt = bcrypt.genSaltSync(10);
      barbeiro.senha = bcrypt.hashSync(senha, salt);
    }
    barbeiro.tipo = tipo;

    if (req.file) {
      barbeiro.imagem = req.file.filename;
      console.log("Imagem carregada:", req.file.filename);
    }

    await barbeiro.save();

    for (let i = 0; i < 7; i++) {
      const diaTrabalho = req.body[`dia_trabalho_${i}`];
      const horaInicio = req.body[`hora_inicio_${i}`];
      const horaFim = req.body[`hora_fim_${i}`];

      if (diaTrabalho && horaInicio && horaFim) {
        let horario = await BarbeiroHorario.findOne({
          where: { barbeiro_id: barbeiro.id_barber, dia_semana: i }
        });

        if (horario) {
          horario.hora_inicio = horaInicio;
          horario.hora_fim = horaFim;
          await horario.save();
        } else {
          await BarbeiroHorario.create({
            barbeiro_id: barbeiro.id_barber,
            dia_semana: i,
            hora_inicio: horaInicio,
            hora_fim: horaFim
          });
        }
      } else {
        await BarbeiroHorario.destroy({
          where: { barbeiro_id: barbeiro.id_barber, dia_semana: i }
        });
      }
    }

    res.redirect('/painelbarb');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao atualizar barbeiro e horários');
  }
});

router.use((req, res, next) => {
  if (req.session && req.session.barbeiro) {
    res.locals.barbeiro = req.session.barbeiro;
  } else {
    res.locals.barbeiro = null;
  }
  next();
});

router.get('/cadastrobarbeiro', barbAut, (req, res) => {
  res.render('admin/cadastroBarbeiro');
});

router.get('/listarFeed', barbAut, async (req, res) => {
  try {
    const feedbacks = await Feedback.findAll({
      include: [
        {
          model: Cliente,
          as: "cliente", 
        },
      ],
    });

    res.render("admin/verFeed", { feedbacks });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
});

router.get('/verbarb', barbAut, async (req, res) => {
  try {
    const barbeiros = await Barbeiro.findAll();

    res.render("admin/verBarbeiros", { barbeiros: barbeiros });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
});

router.get('/barbeiro/editar/:id', async (req, res) => {
  try {
    const barbeiro = await Barbeiro.findByPk(req.params.id);

    if (!barbeiro) {
      return res.status(404).send('Barbeiro não encontrado');
    }

    const horarios = await BarbeiroHorario.findAll({
      where: { barbeiro_id: req.params.id }
    });

    res.render('admin/minhaconta', { barbeiro, horarios });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao carregar informações do barbeiro');
  }
});

router.get('/editarbarbeiro/:id/:nome', async (req, res) => {
  try {
    const barbeiro = await Barbeiro.findByPk(req.params.id);

    if (!barbeiro) {
      return res.status(404).send('Barbeiro não encontrado');
    }

    const horarios = await BarbeiroHorario.findAll({
      where: { barbeiro_id: req.params.id }
    });

    res.render('admin/editarBarbeiro', { barbeiro, horarios });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao carregar informações do barbeiro');
  }
});

router.post('/editarbarbeiro/:id', async (req, res) => {
  try {
    const tipo = req.body.tipo;

    const barbeiro = await Barbeiro.findByPk(req.params.id);
    if (!barbeiro) {
      return res.status(404).send('Barbeiro não encontrado');
    }

    barbeiro.tipo = tipo;
    await barbeiro.save();

    for (let i = 0; i < 7; i++) {
      const diaTrabalho = req.body[`dia_trabalho_${i}`];
      const horaInicio = req.body[`hora_inicio_${i}`];
      const horaFim = req.body[`hora_fim_${i}`];

      if (diaTrabalho && horaInicio && horaFim) {
        let horario = await BarbeiroHorario.findOne({
          where: { barbeiro_id: barbeiro.id_barber, dia_semana: i }
        });

        if (horario) {
          horario.hora_inicio = horaInicio;
          horario.hora_fim = horaFim;
          await horario.save();
        } else {
          await BarbeiroHorario.create({
            barbeiro_id: barbeiro.id_barber,
            dia_semana: i,
            hora_inicio: horaInicio,
            hora_fim: horaFim
          });
        }
      } else {
        await BarbeiroHorario.destroy({
          where: { barbeiro_id: barbeiro.id_barber, dia_semana: i }
        });
      }
    }

    res.redirect(`/editarbarbeiro/${barbeiro.id_barber}/${barbeiro.nome}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao atualizar barbeiro e horários');
  }
});

router.post('/deletabarbeiro', async (req, res) => {
  try {
    const { id } = req.body;

    await TarefaBarbeiro.destroy({
      where: { id_barbeiro: id },
    });

    const barbeiro = await Barbeiro.findByPk(id);
    if (!barbeiro) {
      return res.status(404).send('Barbeiro não encontrado');
    }

    await BarbeiroHorario.destroy({
      where: { barbeiro_id: id },
    });

    await barbeiro.destroy();

    res.redirect('/verbarb');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao deletar o barbeiro');
  }
});

router.post('/barbeiro/cadastro', async (req, res) => {
  try {
    const { nome, sobrenome, email, senha, tipo } = req.body;
    const barbeiro = await Barbeiro.findOne({ where: { email } });

    if (!barbeiro) {
      let criahash = bcrypt.genSaltSync(10);
      let hash = bcrypt.hashSync(senha, criahash);

      const novoBarbeiro = await Barbeiro.create({
        nome,
        sobrenome,
        email,
        senha: hash,
        tipo: tipo
      }, {
        returning: true
      });

      for (let i = 0; i < 7; i++) {
        const horaInicio = req.body[`hora_inicio_${i}`];
        const horaFim = req.body[`hora_fim_${i}`];

        if (horaInicio && horaFim) {
          await BarbeiroHorario.create({
            barbeiro_id: novoBarbeiro.id_barber,
            dia_semana: i,
            hora_inicio: horaInicio,
            hora_fim: horaFim
          });
        }
      }

      res.redirect("/painelbarb");
      console.log("Cadastro Deu Certo");
    } else {
      res.redirect("/cadastrobarbeiro");
      console.log("Cadastro Deu Errado - Barbeiro já cadastrado");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao cadastrar barbeiro');
  }
});

router.get('/painelbarb', (req, res) => {
  if (!req.session.barbeiro) {
    res.redirect('/logincliente');
  } else {
    Barbeiro.findAll().then(barbeiros => {
      res.render('novoADM', { barbeiro: req.session.barbeiro, barbeiros });
    });
  }
});

router.get('/logout1', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;