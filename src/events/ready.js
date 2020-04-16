const Discord = require('discord.js');

module.exports = async client => {
	const guild = client.guilds.get(process.env.GUILD_ID);

	client.user.setPresence({
		status: 'online',
		game: {
			name: 'a qualidade que você procura 💻 | heartdevs.com',
			type: 'STREAMING',
			url: 'https://www.twitch.tv/danielhe4rt',
		},
	});
};
