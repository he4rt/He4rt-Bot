const translate = require('@vitalets/google-translate-api');
const util = require('../util');
const categories = require('../userCategory');

module.exports = {
	async run(client, message, args) {
		const txt = args.join(' ');

		const res = await translate(txt, { to: 'pt' });
		const answer = util.translate('traduzir.answer', [
			res.text,
			res.from.language.iso,
		]);
		await message.channel.send(answer);
	},

	get command() {
		return {
			name: 'traduzir',
			category: categories.USER,
			description: 'Sistema de tradução.',
			usage: 'traduzir',
		};
	},
};
