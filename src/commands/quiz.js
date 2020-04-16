const Discord = require('discord.js');
const categories = require('../userCategory');
const util = require('../util');

const items = [
	{
		question: 'Quem é o principal responsável pelo He4rtBot?',
		answer: ['gustavo', 'smurf', 'logan'],
	},
	{
		question: 'Quem é o ghost mais famoso da He4rt?',
		answer: ['pride', 'gabriel'],
	},
	{
		question: 'Quem criou a He4rt?',
		answer: ['danie reis', 'danielhe4rt', 'frozenhe4rt'],
	},
	{
		question: 'Quando foi criada?',
		answer: [
			'03 de junho de 2018',
			'03 de junho',
			'junho 2018',
			'junho de 2018',
			'junho',
		],
	},
	{
		question:
			'Quem foi o editor responsável pelo vídeo de aniversário do Daniel? ',
		answer: ['brito', 'eduardo'],
	},
	{
		question: 'Por que R4bb1t é um renegado?',
		answer: ['não sei', 'pergaminho'],
	},
	{
		question: 'Quem foi o primeiro a ter a tag He4rt?',
		answer: ['pride', 'gabriel'],
	},
	{ question: 'Quantos anos tem o Specko?', answer: ['16'] },
	{ question: 'Quantos anos tem o Gustavo?', answer: ['14'] },
	{
		question: 'Quando foi postado o primeiro no nosso site?',
		answer: [
			'8 de dezembro de 2018',
			'dezembro',
			'dezembro de 2018',
			'dezembro 2018',
		],
	},
	{
		question: 'Qual o cargo máximo conseguido através do ranking?',
		answer: ['he4rt'],
	},
	{
		question: 'Qual o responsável pela equipe de Moderação?',
		answer: ['julia', 'mãehe4rt'],
	},
	{ question: 'Qaul o Twitter(@) da He4rt?', answer: ['He4rtDevs'] },
	{
		question: 'Qual nome do jogo da velha que o Daniel fez?',
		answer: ['socket-da-velha', 'socket da velha', 'socket'],
	},
	// {question: 'Quantos seguidores tem o Twitter da He4rt?', answer: ['']},
	// {question: 'Quantos usuários apresentados?', answer: ['']},
	{ question: 'Qual é o trabalho da Júlia?', answer: ['nenhum'] },
	{ question: 'Qual o nome do Pride?', answer: ['gabriel'] },
];

const config = {
	max: 1,
	time: 50000,
	errors: ['time'],
};

const random = items[Math.floor(Math.random() * items.length)];

module.exports = {
	async run(client, message) {
		if (!message.member.hasPermission('ADMINISTRATOR')) {
			return message.channel.send(
				new Discord.RichEmbed()
					.setTitle(':x: Você não tem permissão ! :x:')
					.setDescription(
						'Infelizmente você não tem permissão para utilizar esse comando'
					)
					.setFooter(
						util.getYear() + ' © He4rt Developers',
						'https://i.imgur.com/14yqEKn.png'
					)
					.setColor('RED')
					.setTimestamp()
			);
		}

		let tempo = 0;

		const addTime = setInterval(() => {
			tempo += 1;
		}, 1000);

		// Manda o tempo do jogo, a cada 30 seg
		const sendTime = setInterval(() => {
			message.channel.send(
				`⌚ O jogo está rolando! Já se passaram ${tempo + 1} segundos`
			);
		}, 30000);

		const question = new Discord.RichEmbed()
			.setTitle(`\`\`🏆\`\` EVENTO QUIZ\n**${random.question}**`)
			.setDescription(
				'``❗`` Lembre-se que todas as respostas estão em português e somente será válida a que estiver escrita corretamente.'
			)
			.setColor('#FFB900');

		message.channel.send('Irá começar em :three: segundos...');
		setTimeout(() => {
			message.channel.send('Irá começar em :two: segundos...');
		}, 1000);
		setTimeout(() => {
			message.channel.send('Irá começar em :one: segundos...');
		}, 2000);
		setTimeout(() => {
			message.channel.send(question);
		}, 3000);

		try {
			const collector = await message.channel.awaitMessages(
				answer => random.answer.includes(answer.content.toLowerCase()),
				config
			);
			const winnerAnswer = collector.first();
			winnerAnswer.delete();

			const win = new Discord.RichEmbed()
				.setTitle(
					`\`\`🏆\`\` EVENTO QUIZ\n**${winnerAnswer.author.username} acertou.**`
				)
				.setDescription(
					`**Informações:**\n🔹 Ganhador: ${winnerAnswer.author.username}\n🔹 Pergunta: \`\`${random.question}\`\`\n🔹 Premiação: \`\`XP BOOST\`\`.` +
						`\n🔹 Tempo de jogo: \`\`${tempo} segundos\`\`.`
				)
				.setColor('#FFB900');

			message.channel.send(win);
			client.channels.get().send(win);
			clearInterval(addTime);
			return clearInterval(sendTime);
		} catch (e) {
			console.log('aaaaaaaaaaaaa', e);
			// if(e.message == 'time') {
			const timeout = new Discord.RichEmbed()
				.setTitle(
					'``🏆`` EVENTO QUIZ\n**' +
						'Quiz finalizado pois não houve acertos.' +
						'**'
				)
				.setDescription(
					`${'**Informações:**\n🔹 Ganhador: ' +
						'Ninguém' +
						'\n🔹 Pergunta: ``'}${
						random.question
					}\`\`\n🔹 Premiação: \`\`XP BOOST\`\`.` +
						`\n🔹 Tempo de jogo: \`\`${tempo} segundos\`\`.`
				)
				.setColor('#FFB900');
			message.channel.send(timeout);
			clearInterval(addTime);
			return clearInterval(sendTime);
			// }
		}
	},

	get command() {
		return {
			name: 'quiz',
			category: categories.ADM,
			description: 'Comando para iniciar o evento Quiz.',
			usage: 'comando',
		};
	},
};
