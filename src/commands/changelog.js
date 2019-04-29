const Discord = require('discord.js');
const moment = require('moment');
const categories = require('../userCategory');

module.exports = {
	async run(client, message, args) {
		if (!message.member.hasPermission('MANAGE_GUILD')) {
			return message.reply(
				'Você não tem permissão para usar esse comando'
			);
		}

		const data = `${moment().format('L')}`;
		const texto = args.slice(0).join(' ');
		const logs = new Discord.RichEmbed()
			.addField(`:white_small_square: **${data}**`, `${texto}`)
			.setColor('#ffffff');
		return client.channels.get(process.env.CHANGELOG_CHAT).send(logs);
	},

	get command() {
		return {
			name: 'changelog',
			category: categories.MOD,
			description: '',
			usage: 'changelog',
		};
	},
};
