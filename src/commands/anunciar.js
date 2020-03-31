const Discord = require('discord.js');
const categories = require('../userCategory');
const util = require('../util');


module.exports = {
	validate(client, message) {
		if (!message.member.hasPermission('MANAGE_GUILD')) {
			throw new Error('no_permission');
		}
	},
	run: (client, message, args) => {
		// TODO: verificar o que fazer com possivel erro

		const mensg = args.slice(0).join(' ');
		if (!mensg) return null;

		const announce = new Discord.RichEmbed()
			.setTitle('``🔔`` **Heart informa:**')
			.setDescription(mensg)
			.setColor('#8146DC')
			.setFooter(
				util.getYear()+' © He4rt Developers',
				'https://heartdevs.com/wp-content/uploads/2018/12/logo.png'
			)
			.setTimestamp();

		return message.channel.send('@everyone', announce);
	},

	get command() {
		return {
			name: 'anunciar',
			category: categories.MOD,
			description: 'O usuario irá anunciar.',
			usage: 'anunciar',
		};
	},
};
