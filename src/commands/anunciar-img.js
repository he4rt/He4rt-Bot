const Discord = require('discord.js');
const categories = require('../userCategory');
const util = require('../util');

module.exports = {
	validate(client, message) {
		if (!message.member.roles.exists('id', process.env.MOD_ROLE)) {
			throw new Error('no_permission');
		}
	},
	run(client, message, args) {
		// TODO: verificar o que fazer com possivel erro

		const mensg = args.slice(1).join(' ');
		const imageUrl = args[0];

		if (!mensg) return null;
		if (!imageUrl) return null;

		const announceImage = new Discord.RichEmbed()
			.setTitle('``🔔`` **Heart informa:**')
			.setDescription(mensg)
			.setImage(imageUrl)
			.setColor('#8146DC')
			.setFooter(
				`${util.getYear()} © He4rt Developers`,
				'https://i.imgur.com/14yqEKn.png'
			)
			.setTimestamp();

		return message.channel.send('@everyone', announceImage);
	},

	get command() {
		return {
			name: 'anunciar-img',
			category: categories.MOD,
			description: 'O usuario irá anunciar com imagem.',
			usage: 'anunciar-img',
		};
	},
};
