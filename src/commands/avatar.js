const { translate } = require('../util');
const categories = require('../userCategory');

module.exports = {
	async run(client, message) {
		const member = message.mentions.users.first() || message.author;
		const answer = translate('avatar.answer');
		answer.setImage(member.avatarURL);
		await message.channel.send(answer);
	},

	get command() {
		return {
			name: 'avatar',
			category: categories.USER,
			description: 'Irá mostrar o avatar de um usuario.',
			usage: 'avatar',
		};
	},
};
