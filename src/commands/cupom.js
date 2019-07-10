const Discord = require('discord.js');
const categories = require('../userCategory');

module.exports = {
	async run(client, message, args) {
		const { member } = message;

		const coupon = args[0];
		if (coupon) {
			if (coupon === 'gerar') {
				const prize = args[1];
				const type = args[2];

				if (!prize || !type) {
					return message.channel.send(
						'``❌`` Utilize: !cupom gerar <valor> <1 para exp/2 para coin>.'
					);
				}

				if (type < 1 || type > 2) {
					return message.channel.send(
						'``❌`` Utilize: !cupom gerar <valor> <1 para exp/2 para coin>.'
					);
				}

				if (isNaN(prize))
					return message.channel.send('``❗`` Valor inválido.');
				if (isNaN(type))
					return message.channel.send('``❗`` Tipo inválido.');

				client.axios
					.post(`/coupons`, { value: prize, type_id: type })
					.then(res => {
						return message.channel.send(
							`\`\`✅\`\` Cupom criado: \`\`${res.data.name}\`\``
						);
					})
					.catch(err => {
						console.log(err);
					});
			} else {
				client.axios
					.post(`/users/${member.id}/coupon`, { coupon })
					.then(res => {
						const type =
							res.data.coupon.type_id === '1' ? 'exp' : 'HCoins';

						const embed = new Discord.RichEmbed()
							.setTitle('``👑`` » !cupom')
							.setColor('#8146DC')
							.setDescription(
								`Cupom utilizado com sucesso.\n\nVocê ganhou: \`\` ${
									res.data.coupon.value
								} ${type}\`\`.`
							)
							.setFooter(
								`Comando utilizado por: ${message.author.tag}`,
								'https://heartdevs.com/wp-content/uploads/2018/12/logo.png'
							)
							.setTimestamp();

						message.channel.send(embed);
					})
					.catch(() => {
						const embed = new Discord.RichEmbed()
							.setTitle('``❌`` » !cupom')
							.setColor('#8146DC')
							.setDescription(
								'Alguém já utilizou esse cupom ou ele não existe.'
							)
							.setFooter(
								`Comando utilizado por: ${message.author.tag}`,
								'https://heartdevs.com/wp-content/uploads/2018/12/logo.png'
							)
							.setTimestamp();

						message.channel.send(embed);
					});
			}
		} else {
			message.channel.send('``❌`` Utilize: !cupom <cupom>.');
		}
	},

	get command() {
		return {
			name: 'cupom',
			category: categories.USER,
			description: 'Descrição do Comando',
			usage: 'comando',
		};
	},
};
