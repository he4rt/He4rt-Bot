const juntosOptions = require('../../../../assets/juntosQuestionsOptions.json');
const { typesToRoles } = require('./enums');

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

module.exports = {
	formatReactionsAnswers,
};
