const Discord = require('discord.js');
const categories = require('../userCategory');

module.exports = {
	validate(client, message, args) {
		if (!message.member.hasPermission('BAN_MEMBERS')) {
			throw new Error('no_permission');
		}
		const member = message.mentions.members.first();
		if (!member || args.length < 2) {
			throw new Error('invalid_syntax');
		}
		if (!member.bannable) {
			throw new Error('not_bannable');
		}
	},
	async run(client, message, args) {
		const member = message.mentions.members.first();
		const reason = args.slice(1).join(' ');

		const embedPunish = new Discord.RichEmbed()
			.setTitle('``🚔`` » Punição')
			.addField('``👤`` **Usuário punido:**', member.user, true)
			.addField('``👮`` **Punido por:**', message.author, true)
			.addField('``📄`` **Tipo:**', 'Banimento', true)
			.addField('``📣`` **Motivo:**', reason, true)
			.setThumbnail(member.user.avatarURL)
			.setColor('#8146DC')
			.setFooter(
				'2019 © He4rt Developers',
				'https://heartdevs.com/wp-content/uploads/2018/12/logo.png'
			)
			.setTimestamp();

		message.channel
			.send('``✅`` Usuário banido com sucesso.')
			.then(msg => msg.delete(8000));
		member.send('Você foi punido, mais informações abaixo.', embedPunish);
		client.channels.get(process.env.PUNISHMENTS_CHAT).send(embedPunish);
		await member.ban(
			`Motivo: ${reason} | Punido por: ${message.author.tag}`
		);
	},

	get command() {
		return {
			name: 'ban',
			category: categories.MOD,
			description: 'Irá mostrar o avatar de um usuario.',
			usage: 'ban',
		};
	},
};
