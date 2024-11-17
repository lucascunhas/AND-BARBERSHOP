const express = require('express');
const router = express.Router();
const Tarefa = require('../models/Tarefas');
const Barbeiro = require('../models/Barbeiro');
const TarefaBarbeiro = require('../models/TarefaBarbeiro');

router.post('/tarefas/criar', async (req, res) => {
  const { nome, descricao, dataInicio, dataTermino, paraTodos, barbeirosEspecificos } = req.body;

  try {
    const novaTarefa = await Tarefa.create({
      nome, descricao, dataInicio, dataTermino, paraTodos: paraTodos === 'on'
    });

    if (paraTodos === 'on') {
      const todosBarbeiros = await Barbeiro.findAll();
      const tarefasParaTodos = todosBarbeiros.map(barbeiro => ({
        id_barbeiro: barbeiro.id_barber,
        id_tarefa: novaTarefa.id
      }));
      await TarefaBarbeiro.bulkCreate(tarefasParaTodos);
    } else if (barbeirosEspecificos && Array.isArray(barbeirosEspecificos)) {
      const tarefasParaEspecificos = barbeirosEspecificos.map(id_barbeiro => ({
        id_barbeiro,
        id_tarefa: novaTarefa.id
      }));
      await TarefaBarbeiro.bulkCreate(tarefasParaEspecificos);
    } else if (barbeirosEspecificos && !Array.isArray(barbeirosEspecificos)) {
      const tarefasParaEspecificos = [barbeirosEspecificos].map(id_barbeiro => ({
        id_barbeiro,
        id_tarefa: novaTarefa.id
      }));
      await TarefaBarbeiro.bulkCreate(tarefasParaEspecificos);
    }

    res.redirect('/tarefas/listar');
  } catch (error) {
    console.error("Erro ao criar tarefa:", error);
    res.status(500).send("Erro ao criar tarefa");
  }
});

router.get('/tarefas/listar', async (req, res) => {
  const idBarbeiro = req.session.barbeiro?.id_barber;

  console.log("ID Barbeiro na sessão:", idBarbeiro);

  if (!idBarbeiro) {
    return res.status(400).send("Barbeiro não autenticado");
  }

  try {
    const tarefasIds = await TarefaBarbeiro.findAll({
      where: { id_barbeiro: idBarbeiro },
      attributes: ['id_tarefa']
    });

    const idsTarefas = tarefasIds.map(tarefa => tarefa.id_tarefa);

    const tarefas = await Tarefa.findAll({
      where: { id: idsTarefas }
    });

    res.render('tarefas/listarTarefa', { tarefas });
  } catch (error) {
    console.error("Erro ao buscar tarefas:", error);
    res.status(500).send("Erro ao listar tarefas");
  }
});

router.get('/tarefas/criar', async (req, res) => {
  const barbeiros = await Barbeiro.findAll();
  res.render('tarefas/criarTarefa', { barbeiros });
});

router.post('/tarefas/status/:id/concluir', async (req, res) => {
  try {
    const tarefa = await Tarefa.findByPk(req.params.id);
    if (tarefa) {
      tarefa.status = 'Concluída';
      await tarefa.save();
      res.redirect('/tarefas/listar');
    } else {
      res.status(404).send("Tarefa não encontrada");
    }
  } catch (error) {
    console.error("Erro ao concluir tarefa:", error);
    res.status(500).send("Erro ao concluir tarefa");
  }
});

router.post('/tarefas/status/:id/cancelar', async (req, res) => {
  try {
    const tarefa = await Tarefa.findByPk(req.params.id);
    if (tarefa) {
      await tarefa.destroy();
      res.redirect('/tarefas/listar');
    } else {
      res.status(404).send("Tarefa não encontrada");
    }
  } catch (error) {
    console.error("Erro ao cancelar tarefa:", error);
    res.status(500).send("Erro ao cancelar tarefa");
  }
})


module.exports = router;
