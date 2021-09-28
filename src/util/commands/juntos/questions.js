const { promisify } = require('util');

const { isAuthor, isCommand } = require('../../index');
const { typesEnum } = require('./enums');

const juntosOptions = require('../../../../assets/juntosQuestionsOptions.json');
const langPTBR = require('../../../../assets/pt_BR.json');

const TIMEOUT = 60 * 1000;

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
	{
		type: typesEnum.IS_EMPLOYED,
		allowMultipleReactions: false,
		questionJson: juntosOptions.is_employed,
	},
];

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
		if (!isCommand(msg)) {
			collector.stop();
		}
	});
	return collect(collector).then(() => collector);
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
		.send(`${langPTBR.juntos[questionType].title}\n${emojiQuestionText}\n\n
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

const getTextAnswers = async message => {
	const collectors = {};
	const questions = [typesEnum.NAME, typesEnum.GITHUB, typesEnum.LINKEDIN];
	for await (const question of questions) {
		await message.author.send(langPTBR.juntos[question].title);
		collectors[question] = await collectMessage(message);
	}
	return collectors;
};

module.exports = {
	collectMessage,
	getReactionsAnswers,
	getTextAnswers,
};
