const Discord = require('discord.js');

module.exports = {
	run: async (client, message, args) => {
		let page = 1;

		if (args.length) {
			page = parseInt(args[0]);
			if (1 > page) {
				return message.channel.send(
					':x: | Á numero da página tem que ser maior que zero.'
				);
			}
			if (!Number.isInteger(page)) {
				return message.channel.send(':x: | Utilize apenas numeros.');
			}
		}
		const checkRank = args[1] === 'rep' ? '1' : '0';
		const checkOption = args[1] === 'rep' ? 'Reputação' : 'Padrão';
		let count = args[0] ? args[0] : 1;
		count *= 10;
		client.axios
			.get(`/ranking?page=${page}&reputation=${checkRank}`)
			.then(res => {
				console.log(res.data);
				const ranking = res.data;
				const value = [];
				for (const i in ranking.data) {
					const rank = ranking.data[i];
					const user = client.guilds
						.get(process.env.GUILD_ID)
						.members.get(ranking.data[i].discord_id);
					if (user) {
						value.push(
							`${1 + parseInt(i) + (count - 10)} | ${
								user.user.username
							} | Level: ${rank.level} | Exp: ${
								rank.current_exp
							} | Rep: ${rank.reputation === null ? 0 : rank.reputation}`
						);
					} else {
						value.push(
							`${1 +
								parseInt(i) +
								(count - 10)} | Usuário Banido | Level: ${
								rank.level
							} | Exp: ${rank.current_exp} | Rep: ${
								rank.reputation === null ? 0 : rank.reputation
							}`
						);
					}
				}

				const embed = new Discord.RichEmbed()
					.setTitle(`🏆 » !ranking (Ordem: ${checkOption})`)
					.addField(
						`Pagina #${page} de ${ranking.last_page}`,
						value,
						true
					)
					.setColor('#FFB900')
					.setTimestamp();

				message.channel
					.send(`<@${message.author.id}>`, { embed })
					.then(msg => {
						msg.react('⬅').then(r => {
							msg.react('➡');

							const next = (reaction, user) =>
								reaction.emoji.name === '➡' &&
								user.id === message.author.id;
							const back = (reaction, user) =>
								reaction.emoji.name === '⬅' &&
								user.id === message.author.id;

							const nextVerify = msg.createReactionCollector(
								next,
								{ time: 120000 }
							);
							const backVerify = msg.createReactionCollector(
								back,
								{ time: 120000 }
							);

							let t = res.data.current_page;

							nextVerify.on('collect', r => {
								const count = res.data.current_page ? args[0] : 0;

								client.axios
									.get(`/ranking?page=${t + 1}&reputation=1`)
									.then(res => {
										const ranking = res.data;
										const value = [];
										for (const i in ranking.data) {
											const rank = ranking.data[i];
											const user = client.guilds.get(process.env.GUILD_ID).members.get(ranking.data[i].discord_id);
											if (user) {
												value.push(
													`${1 +
														parseInt(i) +
														t * 10} | ${
														user.user.username
													} | Level: ${
														rank.level
													} | Exp: ${
														rank.current_exp
													} | Rep: ${rank.reputation === null ? 0 : rank.reputation}`
												);
											} else {
												value.push(
													`${1 +
														parseInt(i) +
														t *
															10} | Desconhecido | Level: 0 | Exp: 0 | Rep: 0`
												);
											}
										}

										const embed2 = new Discord.RichEmbed()
											.setTitle(
												`🏆 » !ranking (Ordem: ${checkOption})`
											)
											.addField(
												`Pagina #${
													res.data.current_page
												} de ${ranking.last_page}`,
												value,
												true
											)
											.setColor('#FFB900')
											.setTimestamp();
										console.log(value);
										t++;
										msg.edit(
											`<@${message.author.id}>`,
											embed2
										);
									});
							});
							t = res.data.current_page;

							backVerify.on('collect', r => {
								client.axios
									.get(
										`/ranking?page=${t -
											1}&reputation=${checkRank}`
									)
									.then(res => {
										const count2 = res.data.current_page * 10;
										const ranking = res.data;
										const value = [];
										for (const i in ranking.data) {
											const rank = ranking.data[i];
											const user = client.guilds
												.get(process.env.GUILD_ID)
												.members.get(
													ranking.data[i].discord_id
												);
											if (user) {
												value.push(
													`${1 +
														parseInt(i) +
														(count2 - 10)} | ${
														user.user.username
													} | Level: ${
														rank.level
													} | Exp: ${
														rank.current_exp
													}`
												);
											} else {
												value.push(
													`${1 +
														parseInt(i) +
														(count2 -
															10)} | Desconhecido | Level: ${
														rank.level
													} | Exp: ${
														rank.current_exp
													}`
												);
											}
										}
										const embed2 = new Discord.RichEmbed()
											.setTitle(
												`🏆 » !ranking (Ordem: ${checkOption})`
											)
											.addField(
												`Pagina #${
													res.data.current_page
												} de ${ranking.last_page}`,
												value,
												true
											)
											.setColor('#FFB900')
											.setTimestamp();
										msg.edit(
											`<@${message.author.id}>`,
											embed2
										);
										t--;
									});
							});
						});
					});
			})
			.catch(error => console.error);
	},

	get command() {
		return {
			name: 'ranking',
			category: 'Users',
			description: 'Lista o mapeamento dos usuários mais ativos',
			usage: 'ranking',
		};
	},
};
