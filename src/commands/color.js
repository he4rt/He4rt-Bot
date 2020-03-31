const Discord = require('discord.js');
const categories = require('../userCategory');
const util = require('../util');

module.exports = {
	async run(client, message, args) {
		// Add role to .env
		if (!message.member.roles.has(process.env.DONATOR_ROLE)) {
			return message.channel.send(
				new Discord.RichEmbed()
					.setTitle(':x: Você não tem permissão ! :x:')
					.setDescription(
						'Esse comando está disponivel apenas para apoiadores'
					)
					.setFooter(
						util.getYear()+' © He4rt Developers',
						'https://heartdevs.com/wp-content/uploads/2018/12/logo.png'
					)
					.setColor('RED')
					.setTimestamp()
			);
    }
    
		const hex = args[0];
		if (!hex) return message.channel.send('``❌`` Utilize: !color <hex>');

		const nick = message.author.tag;
    const role = message.member.roles.find(x => /.+#\d{4}/i.test(x.name));

		if (!role) {
			return message.guild
				.createRole({
					name: nick,
					color: hex,
					mentionable: false,
					position: 60,
				})
				.then(newRole => {
					message.reply(
						`Cor criada com sucesso! hex(${newRole.color})`
          );
          
					message.member.addRole(newRole);
				})
				.catch(() => message.reply('``❌`` Cor invalida!'));
    }
    
    if (role.name !== nick) {
      await role.setName(nick);
    }

		role.setColor(hex)
			.then(newRole =>
				message.reply(
					`Cor atualizada com sucesso! hex(${newRole.color})`
				)
			)
			.catch(() => message.reply('``❌`` Cor invalida!'));

		return null;
	},

	get command() {
		return {
			name: 'color',
			category: categories.USER,
			description: 'Trocar a cor do nickname',
			usage: '!color <hex>',
		};
	},
};
