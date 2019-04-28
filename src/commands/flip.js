const Discord = require('discord.js');
const categories = require('../userCategory');

module.exports = {
	async run(client, message, args) {
		const value = args.slice(0).join('');

		if (!value) {
			message.channel.send(
				'``❗`` Sintaxe incorreta, utilize ``!flip <valor>``.'
			);
			return;
		}

		const betValue = parseInt(value, 10);

		if (isNaN(betValue)) {
			message.channel.send('``❗`` Valor inválido.');
			return;
		}
		if (betValue > 500) {
			message.channel.send(
				'``❗`` Valor máximo de aposta: ``500 HCoins``.'
			);
			return;
		}

		client.axios.get(`/users/${message.author.id}`).then(res => {
			const userMoney = res.data.money;

			if (userMoney < betValue) {
				message.channel.send(
					`\`\`❗\`\` Seu saldo é menor que ${betValue}.`
				);
				return;
			}

			const embed = new Discord.RichEmbed()
				.setTitle('``👑`` » !flip')
				.setColor('#8146DC')
				.setDescription(
					'Reaja abaixo com os emojis para apostar. \n\n:bust_in_silhouette: para cara ou :crown: para coroa.'
				)
				.addField('**Valor da aposta:**', betValue)
				.setFooter(
					`Comando utilizado por: ${message.author.tag}`,
					'https://heartdevs.com/wp-content/uploads/2018/12/logo.png'
				)
				.setTimestamp();

			message.channel.send(embed).then(async function(msg) {
				await msg.react('👤');
				await msg.react('👑');

				let result = '';
				let userBet = null;

				const generatedNumber = Math.floor(Math.random() * 100) + 1;
				result = generatedNumber < 50 ? 'cara' : 'coroa';

				const filter = (reaction, user) =>
					user.id === message.author.id;
				const collector = msg.createReactionCollector(filter, {
					time: 15000,
				});
				collector.on('collect', r => {
					const { member } = message;

					if (r.emoji.name === '👤') {
						userBet = 'cara';
					} else {
						userBet = r.emoji.name === '👑' ? 'coroa' : null;
					}

					if (userBet != null) {
						const winValue = betValue * 1.5;

						client.axios
							.post(`/users/${member.id}/money/reduce`, {
								value: betValue,
							})
							.catch(err => {
								console.log(err);
							});

						const win = result === userBet;

						if (win) {
							const newEmbed = new Discord.RichEmbed({
								title: '``👑`` » !flip',
								description: `\`\`🏆\`\` Parabéns ${message.author.toString()}, você ganhou ${winValue} HCoins!`,
							});
							r.message.edit(newEmbed);
							client.axios
								.post(`/users/${member.id}/money/add`, {
									value: winValue,
								})
								.catch(err => {
									console.log(err);
								});
						} else {
							const newEmbed = new Discord.RichEmbed({
								title: '``👑`` » !flip',
								description: `\`\`❌\`\` Desculpe ${message.author.toString()}, mas você perdeu ${betValue} HCoins!`,
							});
							r.message.edit(newEmbed);
						}
					}
				});
			});
		});
	},

	get command() {
		return {
			name: 'flip',
			category: categories.USER,
			description: 'Cara ou coroa.',
			usage: 'comando',
		};
	},
};
