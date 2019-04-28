const categories = require('../userCategory');

module.exports = {
	async run(client, message) {},

	get command() {
		return {
			name: 'nome do comando',
			category: categories.USER,
			description: 'Descrição do Comando',
			usage: 'comando',
		};
	},
};
