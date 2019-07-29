const categories = require('../userCategory');

module.exports = {
	validate(client, message) {
		if (!message.member.hasPermission('MANAGE_GUILD')) {
			throw new Error('no_permission');
		}
	},
	async run(client, message, args) {
		const msg = args.slice(0).join(' ');

		if (!msg) {
			return message
				.reply(':x: Voce deve informar uma mensagem')
				.then(msgn => msgn.delete(5000))
				.catch(err => console.log(err));
		}

		message.channel.send(`${msg}`);
	},

	get command() {
		return {
			name: 'say',
			category: categories.MOD,
			description: 'Faz o bot falar algo',
			usage: 'say <msg>',
		};
	},
};
