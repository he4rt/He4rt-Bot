const categories = require('../userCategory');

module.exports = {
	async run(client, message) {
		const { member } = message;
		client.axios
			.post(`/users/${member.id}/daily`)
			.then(res => {
				message.channel.send(
					`\`\`🏆\`\` Você ganhou \`\`${
						res.data.daily
					}\`\` HCoins de bônus diário! Para ver seu saldo, digite \`\`!coins\`\`.`
				);
			})
			.catch(err => {
				message.channel.send(
					`\`\`❌\`\` Você já recebeu seu bônus diário! Tente novamente em: \`\`${err.response.data.time
						.replace('s', ' segundo(s)')
						.replace('m', ' minuto(s), ')
						.replace('h', ' hora(s), ')}\`\`!`
				);
			});
	},

	get command() {
		return {
			name: 'daily',
			category: categories.USER,
			description: 'Coins diários.',
			usage: 'comando',
		};
	},
};
