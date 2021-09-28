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
const {
	cooldownError,
	dmDisabledError,
	alreadyAnsweredError,
	timeoutError,
} = require('../util/commands/juntos/errors');

const cooldown = {};
let collectors = {};

module.exports = {
	async run(client, message) {
		if (cooldown[message.author.id]) {
			throw new Error('cooldown');
		}
		cooldown[message.author.id] = true;

		const answeredGuild = client.guilds
			.get(process.env.GUILD_ID)
			.roles.find(role => role.id === process.env.JSM_FORM_ANSWERED_ROLE);
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

		await message.author.send(langPTBR.juntos[typesEnum.ABOUT].title);
		const aboutAnswer = await collectMessage(message);

		await message.author.send(
			'Agradecemos pela inscrição!\nSuas informações serão encaminhadas ao time de People da Juntos Somos Mais, que poderá entrar em contato contigo hoje através do Discord ou posteriormente através do LinkedIn.\nSe quiser conhecer um pouco mais sobre a Juntos, acesse nosso site (https://www.juntossomosmais.com.br/) e veja nossas vagas na Gupy (https://juntossomosmais.gupy.io/).'
		);

		const formattedReactions = formatReactionsAnswers(reactionAnswers);

		collectors = {
			...textAnswers,
			...formattedReactions,
			[typesEnum.ABOUT]: aboutAnswer,
		};

		await client.guilds
			.get(process.env.GUILD_ID)
			.members.get(message.author.id)
			.addRole(process.env.JSM_FORM_ANSWERED_ROLE);
	},
	async success(client, message) {
		cooldown[message.author.id] = false;

		const embedResponse = createEmbedResponse({
			collectors,
			author: message.author,
			messageGenerator: new Discord.RichEmbed(),
		});

		await client.channels.get(process.env.JSM_CHAT).send(embedResponse);
	},
	async fail(err, client, message) {
		const discordText = new Discord.RichEmbed();

		if (err.message === 'cooldown')
			return cooldownError({ err, message, discordText });
		cooldown[message.author.id] = false;

		if (err.message === 'Cannot send messages to this user')
			return dmDisabledError({ message, discordText });

		if (err.message === 'already_answered')
			return alreadyAnsweredError({ message });

		if (err.message === 'time')
			return timeoutError({ message, discordText });

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
