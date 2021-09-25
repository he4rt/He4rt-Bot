const { promisify } = require('util');
const Discord = require('discord.js');
const categories = require('../userCategory');
const util = require('../util');

const langPTBR = require('../../assets/pt_BR.json');
const roles = require('../../assets/roles.json');

const typesEnum = {
	NAME: 'name',
	GITHUB: 'github',
	LINKEDIN: 'linkedin',
	ROLE: 'role',
	LANGUAGES: 'languages',
};

const TIMEOUT = 60 * 1000;

const isAuthor = (message, author) => message.author.id === author.id;
const collect = promisify((collector, cb) => {
	collector.on('end', (collected, reason) => {
		const collectedArray = collected.array();
		return collectedArray.length
			? cb(null, collectedArray)
			: cb(new Error(reason));
	});
});
const collectMessage = message => {
	const collector = message.author.dmChannel.createMessageCollector(
		({ author }) => isAuthor(message, author),
		{ time: TIMEOUT }
	);
	collector.on('collect', msg => {
		if (!util.isCommand(msg)) {
			collector.stop();
		}
	});
	return collect(collector).then(() => collector);
};

const sendInitialMessage = message =>
	message.author.send(
		new Discord.RichEmbed()
			.setTitle('Questionário da Juntos Somos Mais')
			.setDescription(
				`Vamos fazer algumas perguntas para te conhecer melhor.
        São 8 perguntinhas, sendo apenas uma dissertativa, é rapidinho!

        Todas as informações desse questionário serão enviadas ao time de People da Juntos Somos Mais, que poderá entrar em contato contigo através de DM no Discord durante a He4rt Conf ${util.getYear()} ou DM no LinkedIn após o evento.

        Para cancelar o envio, apenas ignore.`
			)
			.setFooter(
				`${util.getYear()} © He4rt Developers`,
				'https://i.imgur.com/14yqEKn.png'
			)
			.setTimestamp()
	);

const sendChannelMessage = message =>
	message.channel.send(
		new Discord.RichEmbed()
			.setTitle('Processo seletivo da Juntos Somos Mais')
			.setDescription(
				`Olá, ${message.author.username}!
          Agradecemos o interesse em participar do processo seletivo da Juntos Somos Mais na He4rt Conf 2021!

          Para continuar, te enviamos um questionário via DM no Discord.
          Por favor, responda o questionário para prosseguirmos!
          
          Até logo o/
        `
			)
			.setFooter(
				`${util.getYear()} © He4rt Developers`,
				'https://i.imgur.com/14yqEKn.png'
			)
			.setTimestamp()
	);

const sendTextQuestions = async message => {
	const collectors = {};
	const questions = [typesEnum.NAME, typesEnum.GITHUB, typesEnum.LINKEDIN];
	for await (const question of questions) {
		await message.author.send(langPTBR.responder[question].title);
		collectors[question] = await collectMessage(message);
	}
	return collectors;
};

const createEmojiQuestionText = questions => {
	const reactionTextLine = questions
		.map(question => `${question.emoji} - ${question.name}`)
		.join('\n');
	return `${reactionTextLine}\n\n\n✅ - Pronto.`;
};
const sendReactQuestions = async (message, questionJson, questionType) => {
	const emojiQuestionText = createEmojiQuestionText(questionJson);
	const question = await message.author
		.send(`${langPTBR.responder[questionType].title}\n${emojiQuestionText}\n\n
  `);
	for await (const role of questionJson) {
		await question.react(role.emoji);
	}
	await question.react('✅');

	return question;
};

const collectReactions = async ({ author, message, options }) => {
	const collector = message.createReactionCollector(
		(reaction, user) => isAuthor({ author }, user),
		{ time: TIMEOUT }
	);
	collector.on('collect', async reaction => {
		const hasFinished = reaction.emoji.name === '✅';
		if (hasFinished) {
			collector.stop();
			return;
		}

		const selectedRole = options.find(
			role => role.emoji === reaction.emoji.name
		);
		if (!selectedRole) return;

		await author.send('``✅`` Opção adicionada com sucesso!');
	});
	return collect(collector).then(() => collector);
};

module.exports = {
	async run(client, message) {
		sendChannelMessage(message);
		await sendInitialMessage(message);
		await sendTextQuestions(message);

		const techRolesMessage = await sendReactQuestions(
			message,
			roles.tech_roles,
			typesEnum.ROLE
		);
		const techRolesReactions = await collectReactions({
			author: message.author,
			message: techRolesMessage,
			options: roles.tech_roles,
		});
		console.log('techRolesReactions:', techRolesReactions);

		const languagesMessage = await sendReactQuestions(
			message,
			roles.dev_roles,
			typesEnum.LANGUAGES
		);
		const answer = await collectReactions({
			author: message.author,
			message: languagesMessage,
			options: roles.dev_roles,
		});
		console.log('answer:', answer);
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
