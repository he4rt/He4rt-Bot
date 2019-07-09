const categories = require('../userCategory');

module.exports = {
	async run(client, message) {
		const member = message.mentions.users.first();

		if (!member) {
			return message.channel.send('❌ | Utilize ``!rep <@usuário>``.');
		}

		await client.axios
			.post(
				`/users/${message.author.id}/reputation?receive_id=${member.id}`
			)
			.then(() => {
				return message.channel
					.send(
						`✅ | Seu ponto de reputação foi entregue para \`\`${
							member.username
						}\`\`!`
					)
					.then(msg => msg.delete(8000));
			})
			.catch(error => {
				if (error.response.status === '422') {
					if (error.response.data.receive_id) {
						return message.channel
							.send(
								'❌ | Você não pode dar reputação para sí mesmo.'
							)
							.then(msg => msg.delete(8000));
					}
					if (
						error.response.data.error_code === 'already.used.today'
					) {
						return message.channel
							.send(
								`❌ | Você já utilizou seu ponto de reputação diário, aguarde **${
									error.response.data.real_time
								}**.`
							)
							.then(msg => msg.delete(8000));
					}
					return message.channel
						.send('❌ | Erro inesperado, tente novamente.')
						.then(msg => msg.delete(8000));
				}
			});
	},

	get command() {
		return {
			name: 'rep',
			category: categories.USER,
			description: 'Enviar reputações',
			usage: 'rep <@usuário>',
		};
	},
};
