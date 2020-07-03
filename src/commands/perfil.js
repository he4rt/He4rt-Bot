const { RichEmbed } = require('discord.js');
const moment = require('moment');
const util = require('../util');
const categories = require('../userCategory');

moment.locale('pt-BR');

const hiddenRolesSkill = [
	'728382462597660763',
	'728382522370686977',
	'728382580621312113',
];

const hiddenRolesEng = [
	'728383661308903536',
	'728383550969348157',
	'728382933865594881',
];

module.exports = {
	async run(client, message, args) {
		const member = message.mentions.users.first() || message.author;
		const userID = member.id;

		const profile = new RichEmbed()
			.setTitle('`👥` » !profile')
			.setThumbnail(message.author.avatarURL)
			.addField('Nickname:', member.username, false)
			.setColor('#950df5')
			.addField(
				'**Conhecimentos:**',
				client.guilds
					.get(process.env.GUILD_ID)
					.members.get(message.author.id)
					.roles.filter(role => hiddenRolesSkill.includes(role.id))
					.map(role => `<@&${role.id}>`)
					.join(', ') || '`Nenhum`'
			)
			.addField(
				'**Nível de inglês:**',
				client.guilds
					.get(process.env.GUILD_ID)
					.members.get(message.author.id)
					.roles.filter(role => hiddenRolesEng.includes(role.id))
					.map(role => `<@&${role.id}>`)
					.join(', ') || '`Nenhum`'
			)
			.addField(
				'Juntou-se:',
				moment(
					client.guilds.get(process.env.GUILD_ID).members.get(userID)
						.joinedTimestamp
				).format('LLLL')
			)
			.setFooter(
				`Comando utilizado por: ${message.author.tag}`,
				'https://i.imgur.com/rRr6Md6.png'
			);
		await message.channel.send(profile);
	},

	get command() {
		return {
			name: 'profile',
			category: categories.USER,
			description: 'Irá mostrar o perfil de um usuario.',
			usage: 'avatar',
		};
	},
};
