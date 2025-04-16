-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 15/04/2025 às 13:23
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `barb353`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `agendamentos`
--

CREATE TABLE `agendamentos` (
  `id` int(11) NOT NULL,
  `cliente_id` int(11) NOT NULL,
  `servico_id` int(11) NOT NULL,
  `barbeiro_id` int(11) NOT NULL,
  `status` tinyint(4) NOT NULL,
  `data` date NOT NULL,
  `hora` time NOT NULL,
  `hora_fim` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `agendamentos`
--

INSERT INTO `agendamentos` (`id`, `cliente_id`, `servico_id`, `barbeiro_id`, `status`, `data`, `hora`, `hora_fim`) VALUES
(1, 1, 1, 1, 2, '2024-12-09', '16:45:00', '17:00:00'),
(2, 1, 2, 2, 1, '2025-01-24', '14:30:00', '15:00:00');

-- --------------------------------------------------------

--
-- Estrutura para tabela `barbeiro`
--

CREATE TABLE `barbeiro` (
  `id_barber` int(11) NOT NULL,
  `nome` varchar(255) NOT NULL,
  `sobrenome` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `imagem` varchar(255) DEFAULT NULL,
  `tipo` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `barbeiro`
--

INSERT INTO `barbeiro` (`id_barber`, `nome`, `sobrenome`, `email`, `senha`, `imagem`, `tipo`) VALUES
(1, 'Gustavo', 'Henrique', 'gustavo@gmail.com', '$2a$10$lNKgEjsuIjAZTv8knxyr9OguONpT23L8TsvuuZxhNvUi2A.EEnL42', 'upload_1737740180919_Captura de tela 2025-01-24 143006.png', 1),
(2, 'Bruno', 'Eugênio', 'bruno@gmail.com', '$2a$10$lNKgEjsuIjAZTv8knxyr9OguONpT23L8TsvuuZxhNvUi2A.EEnL42', NULL, 2),
(3, 'Eduardo', 'Lima', 'edulima@gmail.com', '$2a$10$lNKgEjsuIjAZTv8knxyr9OguONpT23L8TsvuuZxhNvUi2A.EEnL42', NULL, 2),
(4, 'João', 'Silva', 'joao.silva@example.com', 'senha123', 'imagem.jpg', 4);

-- --------------------------------------------------------

--
-- Estrutura para tabela `barbeiro_horarios`
--

CREATE TABLE `barbeiro_horarios` (
  `id` int(11) NOT NULL,
  `barbeiro_id` int(11) DEFAULT NULL,
  `dia_semana` int(11) NOT NULL,
  `hora_inicio` time NOT NULL,
  `hora_fim` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `barbeiro_horarios`
--

INSERT INTO `barbeiro_horarios` (`id`, `barbeiro_id`, `dia_semana`, `hora_inicio`, `hora_fim`) VALUES
(1, 1, 0, '07:00:00', '20:00:00'),
(2, 1, 1, '07:00:00', '20:00:00'),
(3, 1, 2, '07:00:00', '20:00:00'),
(4, 1, 3, '07:00:00', '20:00:00'),
(5, 1, 4, '07:00:00', '20:00:00'),
(6, 1, 5, '07:00:00', '20:00:00'),
(7, 2, 0, '07:00:00', '20:00:00'),
(8, 2, 1, '07:00:00', '20:00:00'),
(9, 2, 2, '07:00:00', '20:00:00'),
(10, 2, 3, '07:00:00', '20:00:00'),
(11, 2, 4, '07:00:00', '20:00:00'),
(12, 2, 5, '07:00:00', '20:00:00'),
(13, 3, 0, '07:00:00', '20:00:00'),
(14, 3, 1, '07:00:00', '20:00:00'),
(15, 3, 2, '07:00:00', '20:00:00'),
(16, 3, 3, '07:00:00', '20:00:00'),
(17, 3, 4, '07:00:00', '20:00:00'),
(18, 3, 5, '07:00:00', '20:00:00');

-- --------------------------------------------------------

--
-- Estrutura para tabela `cliente`
--

CREATE TABLE `cliente` (
  `id_cliente` int(11) NOT NULL,
  `nome` varchar(255) DEFAULT NULL,
  `sobrenome` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `cpf` varchar(255) DEFAULT NULL,
  `telefone` varchar(255) DEFAULT NULL,
  `dataNasc` date DEFAULT NULL,
  `senha` varchar(255) DEFAULT NULL,
  `imagem` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `cliente`
--

INSERT INTO `cliente` (`id_cliente`, `nome`, `sobrenome`, `email`, `cpf`, `telefone`, `dataNasc`, `senha`, `imagem`) VALUES
(1, 'Lucas', 'Cunhaski', 'luccacunhaski@gmail.com', NULL, NULL, NULL, NULL, 'google_1733709270941.png'),
(2, 'Lucas', 'de Aguiar Cunhaski', 'luccacunhaski@gmail.com', '', '', NULL, '$2a$10$ErUq.hY9HGli42L564JVoez4zYxVPhGUoo.qhGJZU5.B57D0reEjK', ''),
(3, 'Guilherme', 'Francisco Fernandes de Souza', 'guif@gmail.com', '', '', NULL, '$2a$10$ErUq.hY9HGli42L564JVoez4zYxVPhGUoo.qhGJZU5.B57D0reEjK', '');

-- --------------------------------------------------------

--
-- Estrutura para tabela `feedback`
--

CREATE TABLE `feedback` (
  `id` int(11) NOT NULL,
  `cliente_id` int(11) NOT NULL,
  `comentario` text NOT NULL,
  `data_feedback` datetime NOT NULL,
  `avaliacao` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `servicos`
--

CREATE TABLE `servicos` (
  `id` int(11) NOT NULL,
  `nome` varchar(255) NOT NULL,
  `descricao` text NOT NULL,
  `preco` char(10) NOT NULL,
  `tempo` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `servicos`
--

INSERT INTO `servicos` (`id`, `nome`, `descricao`, `preco`, `tempo`) VALUES
(1, 'Recorte Cabelo', 'Limpeza na área de acabamento e pescoço, com lamina e máquina.', '10,00', 15),
(2, 'Corte Social', 'Corte com 1 pente e tesoura, ou raspado simples, lavado e finalizado com gel ou pomada.', '25,00', 30),
(3, 'Degradê', 'Corte partindo da máquina 0 ou pente 1, lavado e finalizado com gel ou pomada.', '30,00', 30),
(4, 'Degradê Navalhado', 'Corte partindo da navalha ou maquina shaver, lavado e finalizado com gel ou pomada.', '35,00', 30),
(5, 'Freestyle', 'Valores a combinar com o barbeiro conforme a arte desejada pelo cliente.', '5,00', 15),
(6, 'Cabelo e Barba', 'Corte partindo da maquina 0 ou pente 1, lavado e finalizado com gel ou pomada. Barba com uso de lâmina e maquina de acabamento, shaving para barba e toalha quente.', '60,00', 60),
(7, 'Bigode', 'Descrição Padrão.', '5,00', 15),
(8, 'Barba', 'Uso de lâmina e máquina de acabamento, shaving para barba e toalha quente.', '30,00', 30),
(9, 'Barboterapia', 'Inclui uso de esfoliante para preparação da pele, toalha quente, shaving para barba, balm pós barba e óleo pós barba e hidratante.', '40,00', 15),
(10, 'Sobrancelha', 'Descrição Padrão.', '10,00', 15),
(11, 'Depilação de Nariz (Cera)', 'Descrição Padrão.', '15,00', 15),
(12, 'Depilação de Orelha (Cera)', 'Descrição Padrão.', '15,00', 15),
(13, 'Limpeza de Pele', 'Uso de creme esfoliante, toalha quente, máscara negra para remoção de impurezas e cravos, creme, protetor ou óleo hidratante.', '50,00', 45),
(14, 'Pigmentação', 'Aplicação de tinta preta no cabelo ou barba.', '40,00', 30),
(15, 'Coloração', 'Uso de tintas no cabelo.', '50,00', 30),
(16, 'Platinado/Descoloração', 'Corte de cabelo já incluso, lavado e finalizado com gel ou pomada.', '180,00', 120);

-- --------------------------------------------------------

--
-- Estrutura para tabela `tarefa`
--

CREATE TABLE `tarefa` (
  `id` int(11) NOT NULL,
  `nome` varchar(255) NOT NULL,
  `descricao` text DEFAULT NULL,
  `dataInicio` datetime NOT NULL,
  `dataTermino` datetime NOT NULL,
  `status` enum('pendente','concluída','cancelada') DEFAULT 'pendente',
  `paraTodos` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `tarefabarbeiro`
--

CREATE TABLE `tarefabarbeiro` (
  `id` int(11) NOT NULL,
  `id_barbeiro` int(11) NOT NULL,
  `id_tarefa` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `agendamentos`
--
ALTER TABLE `agendamentos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cliente_id` (`cliente_id`),
  ADD KEY `servico_id` (`servico_id`),
  ADD KEY `barbeiro_id` (`barbeiro_id`);

--
-- Índices de tabela `barbeiro`
--
ALTER TABLE `barbeiro`
  ADD PRIMARY KEY (`id_barber`);

--
-- Índices de tabela `barbeiro_horarios`
--
ALTER TABLE `barbeiro_horarios`
  ADD PRIMARY KEY (`id`),
  ADD KEY `barbeiro_id` (`barbeiro_id`);

--
-- Índices de tabela `cliente`
--
ALTER TABLE `cliente`
  ADD PRIMARY KEY (`id_cliente`);

--
-- Índices de tabela `feedback`
--
ALTER TABLE `feedback`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cliente_id` (`cliente_id`);

--
-- Índices de tabela `servicos`
--
ALTER TABLE `servicos`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `tarefa`
--
ALTER TABLE `tarefa`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `tarefabarbeiro`
--
ALTER TABLE `tarefabarbeiro`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_barbeiro` (`id_barbeiro`),
  ADD KEY `id_tarefa` (`id_tarefa`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `agendamentos`
--
ALTER TABLE `agendamentos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de tabela `barbeiro`
--
ALTER TABLE `barbeiro`
  MODIFY `id_barber` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de tabela `barbeiro_horarios`
--
ALTER TABLE `barbeiro_horarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT de tabela `cliente`
--
ALTER TABLE `cliente`
  MODIFY `id_cliente` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de tabela `feedback`
--
ALTER TABLE `feedback`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `servicos`
--
ALTER TABLE `servicos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT de tabela `tarefa`
--
ALTER TABLE `tarefa`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `tarefabarbeiro`
--
ALTER TABLE `tarefabarbeiro`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `agendamentos`
--
ALTER TABLE `agendamentos`
  ADD CONSTRAINT `agendamentos_ibfk_1` FOREIGN KEY (`cliente_id`) REFERENCES `cliente` (`id_cliente`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `agendamentos_ibfk_2` FOREIGN KEY (`servico_id`) REFERENCES `servicos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `agendamentos_ibfk_3` FOREIGN KEY (`barbeiro_id`) REFERENCES `barbeiro` (`id_barber`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `barbeiro_horarios`
--
ALTER TABLE `barbeiro_horarios`
  ADD CONSTRAINT `barbeiro_horarios_ibfk_1` FOREIGN KEY (`barbeiro_id`) REFERENCES `barbeiro` (`id_barber`);

--
-- Restrições para tabelas `feedback`
--
ALTER TABLE `feedback`
  ADD CONSTRAINT `feedback_ibfk_1` FOREIGN KEY (`cliente_id`) REFERENCES `cliente` (`id_cliente`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `tarefabarbeiro`
--
ALTER TABLE `tarefabarbeiro`
  ADD CONSTRAINT `tarefabarbeiro_ibfk_1` FOREIGN KEY (`id_barbeiro`) REFERENCES `barbeiro` (`id_barber`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `tarefabarbeiro_ibfk_2` FOREIGN KEY (`id_tarefa`) REFERENCES `tarefa` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
