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

	// polling do tempban
	// setInterval(() => {
	//  client.rest.methods
	//    .getGuildBans(guild)
	//    .then(bans =>
	//      bans.forEach(ban => {
	// timestanp do cara banido
	//        const timeStampBanido = ban.reason
	//          .toString()
	//          .split(' ')[0]
	//          .replace('[', '')
	//          .replace(']', '');

	// Se o timestanp do cara banido for maior que o atual
	//       if (Date.now() > timeStampBanido) {
	//         guild
	//           .unban(ban.user.id)
	//           .then(() =>
	//             console.log(`[#LOG] Usuário desbanido: ${ban.user.id}`)
	//           )
	//          .catch(console.error);
	//       }
	//     })
	//    )
	//    .catch(console.erro);
	// }, 60000); // verifica a cada 1mim

	// funcao para enviar o embed de status
	const enviarEmbedStatus = () => {
		client.guilds.get(process.env.GUILD_ID).members.get('559546465333018654').send('Eae mano, STOCKO FOCA PROGRAMA VAI ;)')
		const randomId = Math.floor(Math.random() * 12 + 1);

		client.db.get(
			`SELECT * FROM curiosidades WHERE id='${randomId}'`,
			(err, result) => {
				if (err) console.error(err);
				else {
					const members = guild.memberCount;

					let numeroMembrosApresentados = 0;
					const lista = guild.members;
					lista.forEach(m => {
						if (m.roles.has(process.env.APRESENTOU_ROLE))
							numeroMembrosApresentados++;
					});

					const embed = new Discord.RichEmbed()
						.setTitle('``⏰`` Página de Status')
						.addField('``💡`` **Curiosidade:**', `${result.text}`)
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

          // client.channels.get(process.env.STATUS_PAGE_CHAT).bulkDelete(1);
          // client.channels.get(process.env.STATUS_PAGE_CHAT).send(embed);
        }
      }
    );
  };

  // depois de 2s que o bot logar, manda uma msg de status
  setTimeout(enviarEmbedStatus, 2000);

  // Manda a msg com o status a cada 35mim
	setInterval(() => {
		enviarEmbedStatus();
	}, 60000 * 35);
};
