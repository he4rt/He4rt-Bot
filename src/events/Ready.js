const { RichEmbed } = require('discord.js');

const { client } = require('../');
const EventBase = require('./EventBase');
const { log } = require('../util/log');

class Ready extends EventBase {
	constructor() {
		super('ready');
	}

	sendStatus = () => {
		const { GUILD_ID, APRESENTOU_ROLE, STATUS_PAGE_CHAT } = process.env;
		const { guilds, channels, ping } = client;

		const { memberCount, members } = guilds.get(GUILD_ID);
		const presentedMembers = members.map(m => m.roles.has(APRESENTOU_ROLE))
			.length;

		const embed = new RichEmbed()
			.setTitle('\\⏰ Página de Status')
			.addField('\\👥 **Usuários:**', `${memberCount}`, true)
			.addField(
				'\\🎓 **Usuários apresentados:**',
				`${presentedMembers}`,
				true,
			)
			.addField(
				'\\📡 **Latência da API:**',
				`${Math.round(ping)}ms`,
				true,
			)
			.setFooter('Última atualização:')
			.setColor('#36393E')
			.setTimestamp();

		channels.get(STATUS_PAGE_CHAT).bulkDelete(1);
		channels.get(STATUS_PAGE_CHAT).send(embed);
	};

	execute = () => {
		client.user.setPresence({
			status: 'online',
			game: {
				name: 'A qualidade que você procura 💻 | heartdevs.com',
				type: 'STREAMING',
				url: 'https://www.twitch.tv/danielhe4rt',
			},
		});

		log('Connected!');

		this.sendStatus();
	};
}

module.exports = Ready;
