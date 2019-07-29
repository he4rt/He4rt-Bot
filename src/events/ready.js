const Discord = require('discord.js');

module.exports = async (client, _) => {
	const guild = client.guilds.get(process.env.GUILD_ID);

	client.user.setPresence({
		status: 'online',
		game: {
			name: 'a qualidade que você procura 💻 | heartdevs.com',
			type: 'STREAMING',
			url: 'https://www.twitch.tv/danielhe4rt',
		},
	});

	const enviarEmbedStatus = () => {

		const members = guild.memberCount;

		let numeroMembrosApresentados = 0;
		const lista = guild.members;
		lista.forEach(m => {
		if (m.roles.has(process.env.APRESENTOU_ROLE))
			numeroMembrosApresentados++;
		});

		const embed = new Discord.RichEmbed()
			.setTitle('``⏰`` Página de Status')
			.addField('``👥`` **Usuários:**', `${members}`, true)
			.addField(	
				'``🎓`` **Usuários apresentados:**',
				`${numeroMembrosApresentados}`,
			true
			)
			.addField(
			'``📡`` **Latência da API:**',
			`${Math.round(client.ping)}ms`,
			true
			)
			.setFooter('Última atualização:')
            .setColor('#36393E')
            .setTimestamp();

        client.channels.get(process.env.STATUS_PAGE_CHAT).bulkDelete(1);
        client.channels.get(process.env.STATUS_PAGE_CHAT).send(embed);
  };

  setTimeout(enviarEmbedStatus, 2000);

	setInterval(() => {
		enviarEmbedStatus();
	}, 60000 * 35);
};
