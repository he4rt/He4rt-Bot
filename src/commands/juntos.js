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

module.exports = {
	async run(client, message) {
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

		await client.channels.get(process.env.JUNTOS_CHAT).send(embedResponse);
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
