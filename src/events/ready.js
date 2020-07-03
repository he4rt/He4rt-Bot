const Discord = require('discord.js');

module.exports = async (client) => {
	const guild = client.guilds.get(process.env.GUILD_ID);

	client.user.setPresence({
		status: 'online',
		game: {
			name: 'twitter.com/He4rtStudios',
			type: 'STREAMING',
			url: 'https://www.twitch.tv/danielhe4rt',
		},
	});
};
