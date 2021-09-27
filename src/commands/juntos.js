const { promisify } = require('util');
const Discord = require('discord.js');
const categories = require('../userCategory');
const util = require('../util');

const langPTBR = require('../../assets/pt_BR.json');
const juntosOptions = require('../../assets/juntosQuestionsOptions.json');

const typesEnum = {
	NAME: 'name',
	GITHUB: 'github',
	LINKEDIN: 'linkedin',
	ROLE: 'role',
	LANGUAGES: 'languages',
	JOB: 'job',
	EXPERIENCE: 'experience',
	ABOUT: 'about',
};

const typesToRoles = {
	[typesEnum.ROLE]: 'tech_roles',
	[typesEnum.LANGUAGES]: 'dev_roles',
	[typesEnum.JOB]: 'jobs_roles',
	[typesEnum.EXPERIENCE]: 'experience_roles',
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

const getTextAnswers = async message => {
	const collectors = {};
	const questions = [typesEnum.NAME, typesEnum.GITHUB, typesEnum.LINKEDIN];
	for await (const question of questions) {
		await message.author.send(langPTBR.responder[question].title);
		collectors[question] = await collectMessage(message);
	}
	return collectors;
};

const createEmojiQuestionText = (questions, allowMultipleReactions) => {
	const reactionTextLine = questions
		.map(question => `${question.emoji} - ${question.name}`)
		.join('\n');
	const text = allowMultipleReactions
		? `${reactionTextLine}\n\n✅ - Pronto.`
		: reactionTextLine;

	return `${text}\n`;
};
const sendReactQuestion = async ({
	message,
	questionJson,
	questionType,
	allowMultipleReactions,
}) => {
	const emojiQuestionText = createEmojiQuestionText(
		questionJson,
		allowMultipleReactions
	);
	const question = await message.author
		.send(`${langPTBR.responder[questionType].title}\n${emojiQuestionText}\n\n
  `);
	for await (const role of questionJson) {
		await question.react(role.emoji);
	}

	if (allowMultipleReactions) await question.react('✅');

	return question;
};

const collectReactions = async ({
	author,
	message,
	options,
	allowMultipleReactions,
}) => {
	const collector = message.createReactionCollector(
		(reaction, user) => isAuthor({ author }, user),
		{ time: TIMEOUT }
	);
	collector.on('collect', async reaction => {
		const hasFinished =
			allowMultipleReactions && reaction.emoji.name === '✅';
		if (hasFinished) {
			collector.stop();
			return;
		}

		const selectedRole = options.find(
			role => role.emoji === reaction.emoji.name
		);
		if (!selectedRole) return;

		await author.send('``✅`` Opção adicionada com sucesso!');

		if (!allowMultipleReactions) collector.stop();
	});

	return collect(collector).then(() => collector);
};

const getReactionsAnswers = async message => {
	const collector = {};

	const reactionsQuestions = [
		{
			type: typesEnum.ROLE,
			allowMultipleReactions: true,
			questionJson: juntosOptions.tech_roles,
		},
		{
			type: typesEnum.LANGUAGES,
			allowMultipleReactions: true,
			questionJson: juntosOptions.dev_roles,
		},
		{
			type: typesEnum.JOB,
			allowMultipleReactions: false,
			questionJson: juntosOptions.jobs_roles,
		},
		{
			type: typesEnum.EXPERIENCE,
			allowMultipleReactions: false,
			questionJson: juntosOptions.experience_roles,
		},
	];

	for await (const question of reactionsQuestions) {
		const questionMessage = await sendReactQuestion({
			message,
			questionJson: question.questionJson,
			questionType: question.type,
			allowMultipleReactions: question.allowMultipleReactions,
		});
		const answer = await collectReactions({
			author: message.author,
			message: questionMessage,
			options: question.questionJson,
			allowMultipleReactions: question.allowMultipleReactions,
		});

		collector[question.type] = answer;
	}

	return collector;
};

const formatRolesString = ({ emojis, key }) => {
	const findEmoji = emoji => option => option.emoji === emoji;

	return emojis
		.map(
			emoji =>
				juntosOptions[typesToRoles[key]].find(findEmoji(emoji)).name
		)
		.join(', ');
};

const formatReactionsAnswers = values => {
	const newValues = values;
	const reactionAnswers = Object.keys(values);
	return reactionAnswers.reduce((obj, key) => {
		newValues[key].collected.delete('✅');

		const emojis = [...newValues[key].collected.keys()];
		const resultString = formatRolesString({ emojis, key });

		return { ...obj, [key]: resultString } || null;
	}, {});
};

const createEmbedResponse = ({ author, collectors }) =>
	new Discord.RichEmbed()
		.setTitle(`**Apresentação** » ${author.username}`)
		.setThumbnail(author.avatarURL)
		.setColor('#8146DC')
		.addField(
			'**Sobre:**',
			collectors[typesEnum.ABOUT].collected.first().content
		)
		.addField(
			'**Nome:**',
			collectors[typesEnum.NAME].collected.first().content
		)
		.addField(
			'**GitHub:**',
			collectors[typesEnum.GITHUB].collected.first().content,
			true
		)
		.addField(
			'**LinkedIn:**',
			collectors[typesEnum.LINKEDIN].collected.first().content,
			true
		)
		.addField(
			'**Áreas de atuação que já trabalhou e/ou tem interesse:**',
			collectors[typesEnum.ROLE]
		)
		.addField('**Vaga que possui interesse:**', collectors[typesEnum.JOB])
		.addField(
			'**Linguagens que conhece:**',
			collectors[typesEnum.LANGUAGES]
		)
		.addField('**Tempo de experiência:**', collectors[typesEnum.EXPERIENCE])
		.setFooter(
			`${util.getYear()} © He4rt Developers e Juntos Somos Mais`,
			'https://i.imgur.com/14yqEKn.png'
		)
		.setTimestamp();

module.exports = {
	async run(client, message) {
		sendChannelMessage(message);
		await sendInitialMessage(message);

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
