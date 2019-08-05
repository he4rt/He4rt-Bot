const { translate } = require('../util');
const categories = require('../userCategory');

module.exports = {
	async run(client, message) {
		const hasRole = !message.member.roles.exists('id', process.env.JOBS_ROLE);
		if (hasRole) {
			await message.member.addRole(process.env.JOBS_ROLE);
			return message.channel.send(`\`\`✅\`\` Você será **notificado** quando houver novas vagas!`);
		} else {
			await message.member.removeRole(process.env.JOBS_ROLE);
			return message.channel.send(`\`\`❗\`\` Você não será **notificado** quando houver novas vagas!`);
		}
	},

	get command() {
		return {
			name: 'jobs',
			category: categories.USER,
			description: 'Receber notificações de trabalhos.',
			usage: 'jobs',
		};
	},
};
