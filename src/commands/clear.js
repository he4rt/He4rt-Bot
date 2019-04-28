const categories = require('../userCategory');

module.exports = {
	validate(client, message) {
		if (!message.member.hasPermission('MANAGE_GUILD')) {
			throw new Error('no_permission');
		}
	},

	async run(client, message, args) {
		if (
			parseInt(args[0], 10) < 1 ||
			args[0] === '' ||
			args[0] === ' ' ||
			args[0] === null
		) {
			return;
		}

		if (parseInt(args[0], 10) > 100) {
			return;
		}

		const number = parseInt(args[0], 10);
		message.channel
			.fetchMessages({ limit: number })
			.then(messages => message.channel.bulkDelete(messages));
	},

	get command() {
		return {
			name: 'clear',
			category: categories.MOD,
			description: 'Irá limpar o chat',
			usage: 'clear <qtd>',
		};
	},
};
