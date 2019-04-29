const categories = require('../userCategory');

module.exports = {
	validate(client, message, args) {
		if (!message.member.hasPermission('BAN_MEMBERS')) {
			throw new Error('permission');
		}

		const member = message.mentions.members.first();
		if (!member) {
			throw new Error('no_user');
		}
		if (!args[1]) {
			throw new Error('no_time');
		}
		if (!args[2]) {
			throw new Error('no_reason');
		}
		if (!member.bannable) {
			throw new Error('not_bannable');
		}
	},
	async run(client, message, args) {
		const member = message.mentions.members.first();
		// minutos para ms
		const time = args[1] * 60 * 1000;
		const reason = args.slice(2).join(' ');

		const desbanirTimeStamp = Date.now() + time;

		// banir a pessoa colocando o timestanp no comeco da reason para usar depois
		await member.ban(
			`[${desbanirTimeStamp}] Motivo: ${reason} | Punido por: ${
				message.author.tag
			}`
		);

		return message.channel.send(
			`O usuario ${member} foi banido por ${time} minutos`
		);
	},
	get command() {
		return {
			name: 'tempban',
			category: categories.MOD,
			description:
				'Irá banir o usuario temporariamente (tempo um minutos)',
			usage: '!tempban @user 5 motivo',
		};
	},
};
