const Discord = require('discord.js');
const categories = require('../userCategory');
const util = require('../util');

module.exports = {
	async validate(client, message, args) {
		if (!message.member.hasPermission('MANAGE_GUILD')) {
			throw new Error('no_permission');
		}
		if (!args[0] || !args.slice(1).join('')) {
			throw new Error('invalid_syntax');
		}
	},
	run: (client, message, args) => {
		const user = args[0];
		const reason = args.slice(1).join(' ');

		const embedUnPunish = new Discord.RichEmbed()
			.setTitle('``🚔`` » Revogou')
			.addField('``👤`` **Usuário desbanido:**', `<@${user}>`, true)
			.addField('``👮`` **Desbanido por:**', message.author, true)
			.addField('``📄`` **Tipo:**', 'Banimento', true)
			.addField('``📣`` **Motivo:**', reason, true)
			.setColor('#00e500')
			.setFooter(
				util.getYear() + ' © He4rt Developers',
				'https://i.imgur.com/14yqEKn.png'
			)
			.setTimestamp();

		message.guild.unban(user);
		message.channel
			.send('``✅`` Usuário desbanido com sucesso.')
			.then(msg => msg.delete(8000));
		client.channels.get(process.env.PUNISHMENTS_CHAT).send(embedUnPunish);
	},

	get command() {
		return {
			name: 'unban',
			category: categories.MOD,
			description: 'Comando para desbanir usuários pelo ID.',
			usage: 'unban',
		};
	},
};
