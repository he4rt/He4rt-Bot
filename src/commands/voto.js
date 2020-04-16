const Discord = require('discord.js');
const categories = require('../userCategory');
const util = require('../util');

module.exports = {
	async run(client, message, args) {
		if (!message.member.hasPermission('ADMINISTRATOR')) {
			return message.channel.send(
				new Discord.RichEmbed()
					.setTitle(':x: Você não tem permissão ! :x:')
					.setDescription(
						'Infelizmente você não tem permissão para utilizar esse'
					)
					.setFooter(
						util.getYear() + ' © He4rt Developers',
						'https://i.imgur.com/14yqEKn.png'
					)
					.setColor('RED')
					.setTimestamp()
			);
		}

		if (!args.join(' ')) {
			return message.channel.send(
				new Discord.RichEmbed()
					.setTitle('Uso incorreto! Você deve informar uma mensagem!')
					.setDescription(
						'Uso correto: !voto <emoji || numero> <mensagem> \nEx. !voto emoji Excluir o chat de visitantes'
					)
					.setFooter(
						util.getYear() + ' © He4rt Developers',
						'https://i.imgur.com/14yqEKn.png'
					)
					.setColor('RED')
					.setTimestamp()
			);
		}

		if (args[0] !== 'emoji' && args[0] !== 'numero') {
			return message.channel.send(
				new Discord.RichEmbed()
					.setTitle(
						"Uso incorreto! Você deve informar 'emoji' ou 'numero'"
					)
					.setDescription(
						'Uso correto: !voto <emoji || numero> <mensagem> \nEx. !voto emoji Excluir o chat de visitantes'
					)
					.setFooter(
						util.getYear() + ' © He4rt Developers',
						'https://i.imgur.com/14yqEKn.png'
					)
					.setColor('RED')
					.setTimestamp()
			);
		}

		let tipo;

		if (args[0] === 'emoji') {
			tipo = 'emoji';
		} else {
			tipo = 'numero';
		}

		// TODO args.shift()
		args[0] = '';

		const text = args.join(' ');

		if (!text) {
			return message.channel.send(
				new Discord.RichEmbed()
					.setTitle('Uso incorreto! Você deve informar uma mensagem!')
					.setDescription(
						'Uso correto: !voto <emoji || numero> <mensagem> \nEx. !voto emoji Excluir o chat de visitantes'
					)
					.setFooter(
						util.getYear() + ' © He4rt Developers',
						'https://i.imgur.com/14yqEKn.png'
					)
					.setColor('RED')
					.setTimestamp()
			);
		}

		message.channel
			.send(
				new Discord.RichEmbed()
					.setTitle(
						':call_me_hand::skin-tone-2: Nova votação! :call_me_hand::skin-tone-2:'
					)
					.setDescription(text)
					.setFooter(
						`Votação iniciada por: ${message.author.username}`,
						'https://i.imgur.com/14yqEKn.png'
					)
					.setColor('GREEN')
					.setTimestamp()
			)
			.then(async m => {
				if (tipo === 'emoji') {
					await m.react('✅');
					await m.react('❌');
				} else {
					await m.react('1⃣');
					await m.react('2⃣');
					await m.react('3⃣');
				}
			})
			.catch(e => console.log(e));
	},

	get command() {
		return {
			name: 'voto',
			category: categories.ADM,
			description: 'Iniciar uma votação',
			usage: '!voto <emoji || numero> <mensagem>',
		};
	},
};
