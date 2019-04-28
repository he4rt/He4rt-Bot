const Discord = require('discord.js');
const categories = require('../userCategory');

module.exports = {
	async run(client, message, args) {
		const member = message.mentions.members.first();
		const reason = args.slice(1).join(' ');

		if (!message.member.hasPermission('BAN_MEMBERS')) {
			return message.reply(
				':x: Você não tem permissão para utilizar esse comando'
			);
		}
		if (!member) {
			return message.reply(':x: Você deve informar um nick Ex. @Daniel');
		}
		if (!reason) {
			return message.reply(':x: Você deve informar um motivo');
		}
		if (!member.bannable) {
			return message.reply(':x: Essa pessoa não está apta a ser banida');
		}

		member.addRole(process.env.MUTE_ID);

		const embedPunish = new Discord.RichEmbed()
			.setTitle('``🚔`` » Punição')
			.addField('``👤`` **Usuário mutado:**', member.user, true)
			.addField('``👮`` **Mutado por:**', message.author, true)
			.addField('``📄`` **Tipo:**', 'Mute', true)
			.addField('``📣`` **Motivo:**', reason, true)
			.setThumbnail(member.user.avatarURL)
			.setColor('#8146DC')
			.setFooter(
				'2019 © He4rt Developers',
				'https://heartdevs.com/wp-content/uploads/2018/12/logo.png'
			)
			.setTimestamp();

		message.channel
			.send(
				new Discord.RichEmbed()
					.setTitle('``✅`` Usuário mutado com sucesso.')
					.addField('**Motivo: **', reason, true)
			)
			.then(msg => msg.delete(8000));
		member.send('Você foi mutado, mais informações abaixo.', embedPunish);
		client.channels.get(process.env.PUNISHMENT_CHAT).send(embedPunish);
	},

	get command() {
		return {
			name: 'mute',
			category: categories.MOD,
			description: 'Irá mutar o usuario',
			usage: 'mute <nick> <motivo>',
		};
	},
};
