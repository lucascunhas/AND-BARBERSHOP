const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const slugify = require('slugify');
const Agendamentos = require('../models/Agendamentos');
const Servico = require('../models/Servicos');
const Cliente = require('../models/Cliente');
const Planos = require('../models/Planos');
const db = require('../config/db');
const adminAut = require('../middlewares/adminAutoriz');
const popularClienteLogado = require('../middlewares/popularClienteLogado');
const Barbeiro = require('../models/Barbeiro');
const BarbeiroHorario = require('../models/BarbeiroHorario');
const nodemailer = require('nodemailer');

router.use(bodyParser.urlencoded({extended:true}));

const dbPool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'barb353'
});

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', 
  port: 587,  
  secure: false, 
  auth: {
    user: 'luccacunhaski@gmail.com',
    pass: 'aanu gbdl sxla srcu'
  }
});

router.get("/agendamentos", adminAut, (req,res)=>{
    Servico.findAll().then((servicos) => {
      Cliente.findAll().then(clientes => {
    res.render("agendar/selecioneServico", {servicos, cliente: req.session.cliente, clientes});
  })
})
})

router.get('/verAgendamentos', popularClienteLogado, async (req, res) => {
  try {
    const clienteId = req.user.id_cliente;

    if (!clienteId) {
      throw new Error("Cliente não está logado ou não possui um ID válido.");
    }

    const query = `
    SELECT 
      a.id AS agendamento_id,
      s.nome AS servico_nome,
      s.descricao AS servico_descricao,
      s.preco AS servico_preco,
      DATE_FORMAT(a.data, '%d/%m/%Y') AS agenda_data,
      TIME_FORMAT(a.hora, '%H:%i') AS agenda_hora,
      TIME_FORMAT(a.hora_fim, '%H:%i') AS agenda_hora_fim,
      a.status AS agendamento_status,
      b.nome AS barbeiro_nome  -- Adicionando o nome do barbeiro
    FROM 
      agendamentos a
    JOIN 
      servicos s ON a.servico_id = s.id
    JOIN 
      barbeiro b ON a.barbeiro_id = b.id_barber
    WHERE 
      a.cliente_id = ?
    ORDER BY 
      a.data ASC, 
      a.hora ASC;
`;

    const result = await db.query(query, { replacements: [clienteId], type: db.QueryTypes.SELECT });

    Cliente.findAll().then(clientes => {
      res.render('agendar/verAgendamentos', { agendamentos: result, cliente: req.session.cliente, clientes });
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
});

router.get('/verAgendamentosbarb', popularClienteLogado, async (req, res) => {
  const barbeiroId = req.session.barbeiro.id_barber;

  if (!barbeiroId) {
    throw new Error("Cliente não está logado ou não possui um ID válido.");
  }

  const dataFiltro = req.query.data || null; // Captura a data enviada pelo formulário ou usa null como padrão.

  try {
    let query = `
    SELECT 
      a.id AS agendamento_id,
      s.nome AS servico_nome,
      s.descricao AS servico_descricao,
      s.preco AS servico_preco,
      DATE_FORMAT(a.data, '%d/%m/%Y') AS agenda_data,
      TIME_FORMAT(a.hora, '%H:%i') AS agenda_hora,
      TIME_FORMAT(a.hora_fim, '%H:%i') AS agenda_hora_fim,
      c.nome AS cliente_nome,
      a.status AS agendamento_status
    FROM 
      agendamentos a
    JOIN 
      servicos s ON a.servico_id = s.id
    JOIN 
      cliente c ON a.cliente_id = c.id_cliente 
    WHERE 
      a.barbeiro_id = ?
    `;

    const replacements = [barbeiroId];

    // Adiciona a cláusula de filtro de data se a dataFiltro estiver definida.
    if (dataFiltro) {
      query += ` AND a.data = ?`;
      replacements.push(dataFiltro); // Adiciona a data ao array de substituições.
    }

    query += ` ORDER BY a.data ASC, a.hora ASC;`;

    const result = await db.query(query, { replacements, type: db.QueryTypes.SELECT });

    Barbeiro.findAll().then((barbeiros) => {
      res.render('agendar/verAgendamentosbarb', { 
        agendamentos: result, 
        barbeiro: req.session.barbeiro, 
        barbeiros, 
        dataFiltro // Envia a data atual para o EJS, caso precise exibi-la no formulário.
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
});

router.post('/agendamentos/:id/cancelar', async (req, res) => {
  try {
    const agendamentoId = req.params.id;

    await Agendamentos.destroy({
      where: { id: agendamentoId }
    });

    await Agendamentos.update({ status: 3 }, { where: { id: agendamentoId } });

    res.redirect('/verAgendamentos');
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao cancelar o agendamento.');
  }
});

router.post('/agendamentos/:id/finalizar', async (req, res) => {
  try {
    const agendamentoId = req.params.id;

    await Agendamentos.update({ status: 2 }, { where: { id: agendamentoId } });

    res.redirect('/verAgendamentosbarb');
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao finalizar o agendamento.');
  }
});

router.get('/reserveagora/:id', async (req, res) => {
  const id = req.params.id;
  Servico.findByPk(id).then((servico) =>{
    Barbeiro.findAll().then((barbeiros) => {
      Cliente.findAll().then(clientes => {
    res.render("agendar/agendamentos",{servico, barbeiros, cliente: req.session.cliente, clientes})
      })
    })
})
});

router.get('/horarios/:barbeiroId/:data/:servicoId', async (req, res) => {
  try {
    const barbeiroId = req.params.barbeiroId;
    const data = req.params.data;
    const servicoId = req.params.servicoId;

    const diaSemana = new Date(data).getDay();

    const horarios = await BarbeiroHorario.findOne({
      where: {
        barbeiro_id: barbeiroId,
        dia_semana: diaSemana
      }
    });

    if (horarios) {
      const horaInicio = horarios.hora_inicio;
      const horaFim = horarios.hora_fim;

      const servico = await Servico.findOne({ where: { id: servicoId } });
      const duracaoServico = servico.tempo;

      const agendamentos = await Agendamentos.findAll({
        where: {
          barbeiro_id: barbeiroId,
          data: data
        }
      });

      const horariosDisponiveis = [];
      let horaAtualFormatada = new Date(`1970-01-01T${horaInicio}Z`);
      let horaFimFormatada = new Date(`1970-01-01T${horaFim}Z`);

      while (horaAtualFormatada < horaFimFormatada) {
        const horaAtualStr = horaAtualFormatada.toISOString().substring(11, 16);
        let horarioDisponivel = true;

        for (let agendamento of agendamentos) {
          const horaAgendada = new Date(`1970-01-01T${agendamento.hora}Z`);
          const horaFimAgendada = new Date(`1970-01-01T${agendamento.hora_fim}Z`);

          if (
            (horaAtualFormatada >= horaAgendada && horaAtualFormatada < horaFimAgendada) || 
            (horaFimFormatada > horaAgendada && horaFimFormatada <= horaFimAgendada)
          ) {
            horarioDisponivel = false;
            break;
          }
        }

        const horaAtualNum = parseInt(horaAtualStr.substring(0, 2), 10);
        if (horaAtualNum >= 12 && horaAtualNum < 13) {
          horarioDisponivel = false;
        }

        if (horarioDisponivel) {
          horariosDisponiveis.push(horaAtualStr);
        }

        horaAtualFormatada.setMinutes(horaAtualFormatada.getMinutes() + duracaoServico);
      }

      res.json(horariosDisponiveis);
    } else {
      res.json([]);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao obter horários');
  }
});


router.post('/salvaagendamento/:servicoId', async (req, res) => {
  const servicoId = req.params.servicoId;
  const { data, hora, barbeiroId } = req.body;
  const clienteId = req.session.cliente.id_cliente;
  const clienteEmail = req.session.cliente.email;

  const formatarData = (data) => {
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  try {
    const conn = await dbPool.getConnection();
    await conn.beginTransaction();

    try {
      const [servico] = await conn.execute(
        'SELECT nome, tempo FROM servicos WHERE id = ?',
        [servicoId]
      );
      const duracaoServico = servico[0].tempo;
      const nomeServico = servico[0].nome;

      const horaInicio = new Date(`1970-01-01T${hora}Z`);
      const horaFim = new Date(horaInicio);
      horaFim.setMinutes(horaFim.getMinutes() + duracaoServico);
      const horaFimFormatada = horaFim.toISOString().substring(11, 16);

      await conn.execute(
        'INSERT INTO agendamentos (cliente_id, servico_id, barbeiro_id, data, hora, hora_fim, status) VALUES (?, ?, ?, ?, ?, ?, 1)',
        [clienteId, servicoId, barbeiroId, data, hora, horaFimFormatada]
      );

      const dataFormatada = formatarData(data);

      const mailOptions = {
        from: 'luccacunhaski@gmail.com',
        to: clienteEmail,
        subject: 'And Barbershop - Confirmação de Agendamento',
        html: `
          <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f9;
                margin: 0;
                padding: 0;
              }
              .container {
                width: 100%;
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                border-radius: 8px;
                padding: 20px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
              }
              .header {
                text-align: center;
                background-color: #007bff;
                color: white;
                padding: 10px 0;
                border-radius: 8px 8px 0 0;
              }
              .content {
                padding: 20px;
                font-size: 16px;
                color: #333333;
              }
              .footer {
                text-align: center;
                font-size: 14px;
                color: #888888;
                margin-top: 20px;
              }
              .button {
                display: inline-block;
                background-color: #28a745;
                color: white;
                padding: 10px 20px;
                text-decoration: none;
                border-radius: 4px;
                font-weight: bold;
                margin-top: 20px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2>Confirmação de Agendamento</h2>
              </div>
              <div class="content">
                <p>Olá,</p>
                <p>Seu agendamento para o serviço <strong>${nomeServico}</strong> foi confirmado com sucesso.</p>
                <p><strong>Data:</strong> ${dataFormatada}</p>
                <p><strong>Hora:</strong> ${hora}</p>
                <p><strong>Barbeiro:</strong> ${barbeiroId}</p>
                <p>Se tiver algum problema, entre em contato conosco.</p>
                <a href="http://localhost:3000/verAgendamentos" class="button">Ver meus agendamentos</a>
              </div>
              <div class="footer">
                <p>Obrigado por escolher a And Barbershop!</p>
              </div>
            </div>
          </body>
          </html>
        `
      };

      transporter.sendMail(mailOptions);
      await conn.commit();
      conn.release();
      res.redirect('/verAgendamentos?confirmado=true');

    } catch (err) {
      await conn.rollback();
      conn.release();
      console.error('Erro ao salvar o agendamento:', err);
      res.status(500).send({ mensagem: 'Erro ao salvar o agendamento.' });
    }
  } catch (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    res.status(500).send({ mensagem: 'Erro ao conectar ao banco de dados.' });
  }
});

module.exports = router;