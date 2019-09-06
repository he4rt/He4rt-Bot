const moment = require('moment');
const util = require('../util');
const categories = require('../userCategory');

moment.locale('pt-BR');

const hiddenRolesDev = [
	'540994118634176512',
	'540994295541399552',
	'540995072246939648',
	'540995379538165774',
	'540995627559944207',
	'541021498064896000',
	'540993488410378281',
	'546152565633449995',
];

const hiddenRolesEng = [
	'546148712833875985',
	'546148711416332298',
	'546148708077666315',
];

module.exports = {
	async run(client, message, args) {
		const member = message.mentions.users.first() || message.author;
		const userID = member.id;

		const { data: user } = await client.axios.get(`/users/${userID}`);

		if (args.length) {
			console.log('puta merda');
			const options = ['about', 'git', 'name', 'nickname', 'language'];
			const filtered = options.filter(val => val === args[0]);
			if (filtered.length && options.includes(args[0])) {
				await client.axios.put(`/users/${userID}`, {
					[args[0]]: args.slice(1).join(' '),
				});
				const answer = await message.channel.send(
					'Seu perfil foi atualizado com sucesso! Use o comando !profile para acessar suas informações!'
				);
				answer.delete(8000);
			} else {
				const answer = await message.channel.send('Comando invalido!');
				answer.delete(8000);
			}
		} else {
			const engRoles =
				client.guilds
					.get(process.env.GUILD_ID)
					.members.get(member.id)
					.roles.filter(role => hiddenRolesEng.includes(role.id))
					.map(role => `<@&${role.id}>`)
					.join(', ') || '`Nenhuma`';
			const devRoles =
				client.guilds
					.get(process.env.GUILD_ID)
					.members.get(member.id)
					.roles.filter(role => hiddenRolesDev.includes(role.id))
					.map(role => `<@&${role.id}>`)
					.join(', ') || '`Nenhuma`';

			const answer = util.translate('perfil.answer', [
				user.name
					? `${member.username} (${user.name})`
					: `${member.username}`,
				user.about || 'Desconhecido',
				user.git || 'Desconhecido',
				user.level || 'Desconhecido',
				user.current_exp || 'Desconhecido',
				`<:hcoin:548969665020297216> ${user.money}`,
				devRoles || 'Desconhecido',
				engRoles || 'Desconhecido',
				`${moment(
					client.guilds
						.get(process.env.GUILD_ID)
						.members.get(message.author.id).joinedTimestamp
				).format('LLLL')} **#${user.id}**`,
			]);
			answer.setThumbnail(member.avatarURL);
			answer.setFooter(
				`Comando utilizado por: ${message.author.tag}`,
				'https://heartdevs.com/wp-content/uploads/2018/12/logo.png'
			);
			answer.setTimestamp();
			await message.channel.send(answer);
		}
	},

	get command() {
		return {
			name: 'profile',
			category: categories.USER,
			description: 'Irá mostrar o perfil de um usuario.',
			usage: 'avatar',
		};
	},
};
