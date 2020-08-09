const Discord = require('discord.js');
const { scheduleJob } = require('node-schedule');

module.exports = async client => {
	const guild = client.guilds.get(process.env.GUILD_ID);

	guild.members
		.filter(m => m.roles.find('id', '735623088414261268'))
		.map(m =>
			m.sendMessage(
				'Não esqueça de marcar seu 1 on 1 através do link https://calendly.com/he4rtmarketing/1on1 !'
			)
		);
	scheduleJob('0 0 11 */15 * *', () => {
		guild.members
			.filter(m => m.roles.find('id', '735623088414261268'))
			.map(m =>
				m.sendMessage(
					'Não esqueça de marcar seu 1 on 1 através do link https://calendly.com/he4rtmarketing/1on1 !'
				)
			);
	});

	client.user.setPresence({
		status: 'online',
		game: {
			name: 'Olá :D',
			type: 'STREAMING',
			url: 'https://www.twitch.tv/danielhe4rt',
		},
	});
};
