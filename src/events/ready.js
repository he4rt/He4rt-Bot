module.exports = async client => {
	client.user.setPresence({
		status: 'online',
		game: {
			name: 'Olá :D',
			type: 'STREAMING',
			url: 'https://www.twitch.tv/danielhe4rt',
		},
	});
};
