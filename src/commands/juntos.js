const Discord = require('discord.js');
const categories = require('../userCategory');

const langPTBR = require('../../assets/pt_BR.json');

const { typesEnum } = require('../util/commands/juntos/enums');
const { formatReactionsAnswers } = require('../util/commands/juntos/format');
const {
	sendChannelMessage,
	sendInitialMessage,
} = require('../util/commands/juntos/messages');
const {
	collectMessage,
	getReactionsAnswers,
	getTextAnswers,
} = require('../util/commands/juntos/questions');
const { createEmbedResponse } = require('../util/commands/juntos/answers');

const cooldown = {};
module.exports = {
	async run(client, message) {
		if (cooldown[message.author.id]) {
			throw new Error('cooldown');
		}
		cooldown[message.author.id] = true;

		const answeredGuild = client.guilds
			.get(process.env.GUILD_ID)
			.roles.find(role => role.name === '🎓 Fomulário JS+ respondido');
		const alreadyAnswered = client.guilds
			.get(process.env.GUILD_ID)
			.members.get(message.author.id)
			.roles.some(role => role.name === answeredGuild.name);
		if (alreadyAnswered) throw new Error('already_answered');

		const messageProps = {
			message,
			messageGenerator: new Discord.RichEmbed(),
		};
		sendChannelMessage(messageProps);
		await sendInitialMessage(messageProps);

		const textAnswers = await getTextAnswers(message);
		const reactionAnswers = await getReactionsAnswers(message);

		await message.author.send(langPTBR.responder[typesEnum.ABOUT].title);
		const aboutAnswer = await collectMessage(message);

		await message.author.send(
			'Agradecemos pela inscrição!\nSuas informações serão encaminhadas ao time de People da Juntos Somos Mais, que poderá entrar em contato contigo hoje através do Discord ou posteriormente através do LinkedIn.\nSe quiser conhecer um pouco mais sobre a Juntos, acesse nosso site (https://www.juntossomosmais.com.br/) e veja nossas vagas na Gupy (https://juntossomosmais.gupy.io/).'
		);

		const formattedReactions = formatReactionsAnswers(reactionAnswers);

		const collectors = {
			...textAnswers,
			...formattedReactions,
			[typesEnum.ABOUT]: aboutAnswer,
		};

		const embedResponse = createEmbedResponse({
			collectors,
			author: message.author,
			messageGenerator: new Discord.RichEmbed(),
		});

		await client.channels.get(process.env.JSM_CHAT).send(embedResponse);

		await client.guilds
			.get(process.env.GUILD_ID)
			.members.get(message.author.id)
			.addRole(process.env.JSM_FORM_ANSWERED_ROLE);
	},
	async fail(err, client, message) {
		if (err.message === 'cooldown') {
			const cooldownEmbed = new Discord.RichEmbed()
				.setTitle(
					'``❌`` **Você já utilizou este comando, verifique sua DM para mais informações.**'
				)
				.setColor('#36393E');
			return message.channel.send(cooldownEmbed);
		}
		cooldown[message.author.id] = false;

		// geralmente quando user ta com dm desativada
		if (err.message === 'Cannot send messages to this user') {
			const dmDisabled = new Discord.RichEmbed()
				.setTitle('``❌`` **Sua DM do Discord está fechada.**')
				.setDescription(
					`Ops, parece que sua DM do Discord está fechada e não foi possível enviar mensagem.
					Por favor, libere sua DM para receber mensagens e execute o comando novamente`
				)
				.setColor('#36393E');
			return message.channel.send(dmDisabled);
		}
		if (err.message === 'already_answered') {
			return message.channel
				.send('``❌`` Você já respondeu esse fomulário.')
				.then(msg => msg.delete(10000));
		}
		if (err.message === 'time') {
			const timeout = new Discord.RichEmbed()
				.setTitle('``❌`` **Tempo limite de resposta excedido.**')
				.setDescription(
					'Para enviar as respostas será necessário executar o comando !juntos novamente.'
				)
				.setColor('#36393E');
			return message.author.send(timeout);
		}
		return null;
	},

	get command() {
		return {
			name: 'juntos',
			category: categories.USER,
			description:
				'Questionário para participação no processo seletivo da Juntos Somos Mais em parceria com He4rt Developers',
			usage: 'juntos',
		};
	},
};
