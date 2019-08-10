const categories = require('../userCategory');

module.exports = {
	async run(client, message) {
		const { member } = message;
		const donatorRole = member.roles.find(
			r => r.id === process.env.DONATOR_ROLE
		);
		client.axios
			.post(`/users/${member.id}/daily`, {
				donator: !!donatorRole,
			})
			.then(res => {
				return message.channel.send(
					`\`\`🏆\`\` Você ganhou \`\`${
						res.data.daily
					}\`\` HCoins de bônus diário! Para ver seu saldo, digite \`\`!coins\`\`. ${
						donatorRole ? '(DoubleCoins ✅)' : ''
					}`
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
