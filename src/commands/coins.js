const Discord = require('discord.js');
const categories = require('../userCategory');
const util = require('../util');

module.exports = {
	async run(client, message, args) {
		let userMoney = 0;
		if (!args[0]) {
			client.axios.get(`/users/${message.author.id}`).then(res => {
				message.channel.send(
					`\`\`💸\`\` <@${message.author.id}>  seu saldo é de: ${res.data.money} HCoins.`
				);
			});
			return;
		}

		if (!message.member.hasPermission('ADMINISTRATOR')) {
			return message.channel.send(
				new Discord.RichEmbed()
					.setTitle('``❌`` » Sem permissão!')
					.setDescription(
						'Infelizmente você não tem permissão para utilizar esse comando.'
					)
					.setFooter(
						util.getYear()+' © He4rt Developers',
						'https://heartdevs.com/wp-content/uploads/2018/12/logo.png'
					)
					.setColor('RED')
					.setTimestamp()
			);
		}

		const member = message.mentions.members.first();
		const quantity = args[2];
		if (!args[0] || !args[1] || isNaN(quantity) || quantity < 1) {
			return message.channel.send(
				'``🎲`` Como utilizar o comando: ``!coins <@usuário> <add/remove> <valor>``.'
			);
		}
		if (member) {
			if (args[1] === 'add' && quantity) {
				client.axios
					.post(`/users/${member.id}/money/add`, { value: quantity })
					.then(res => {
						return message.channel.send(
							`\`\`✅\`\` Foram adicionados ${quantity} HCoins na conta do usuário <@${
								member.id
							}>`
						);
					})
					.catch(err => {
						console.log(err);
					});
			} else if (args[1] === 'remove' && quantity) {
				client.axios
					.post(`/users/${member.id}/money/reduce`, {
						value: quantity,
					})
					.then(res => {
						return message.channel.send(
							`\`\`❌\`\` Foram removidos ${quantity} HCoins da conta do usuário <@${
								member.id
							}>`
						);
					})
					.catch(err => {
						console.log(err);
					});
			} else if (args[1] === 'enviar' && quantity) {
				client.axios.get(`/users/${message.author.id}`).then(res => {
					userMoney = res.data.money
					
					if (userMoney < quantity) {
						return message.channel.send(
							`\`\`❗\`\`  <@${message.author.id}>  seu saldo é menor que ${quantity}.`
						)
					} else {
						client.axios.post(`/users/${message.author.id}/money/reduce`, {
							value: quantity,
						})
						client.axios.post(`/users/${member.id}/money/add`, {
							value: quantity,
						})
						.then(res => {
							return message.channel.send(
								`\`\`❌\`\` Foram removidos ${quantity} HCoins da conta do usuário <@${
									message.author.id
								}> e adicionados ${quantity} HCoins na conta do usuario <@${member.id}>`
							)
						})
					}
				})
			} 
		} else {
			return message.channel.send('``❌`` Usuário não existente.');
		}
	},

	get command() {
		return {
			name: 'coins',
			category: categories.MOD,
			description:
				'Dar ou Remover uma certa quantia de coins de um determinado user',
			usage: 'coins <@user> <add/remove/enviar> <quantia>',
		};
	},
};
