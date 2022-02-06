const moment = require('moment');
const categories = require('../userCategory');

module.exports = {
	async run(client, message) {
		const { member } = message;
		const donatorRole = member.roles.find(
			r => r.id === process.env.DONATOR_ROLE
		);
		client.axios
			.post(`/users/daily?discord_id=${member.id}`, {
				donator: !!donatorRole,
			})
			.then(res => {
				return message.channel.send(
					`\`\`🏆\`\` Você ganhou \`\`${
						res.data.points
					}\`\` HCoins de bônus diário! Para ver seu saldo, digite \`\`!coins\`\`. ${
						donatorRole ? '(DoubleCoins ✅)' : ''
					}`
				);
			})
			.catch(err => {
				const data = moment(err.response.data.time).calendar();
				message.channel.send(
					`\`\`❌\`\` Você já recebeu seu bônus diário! Tente novamente \`\`${data}\`\`!`
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
