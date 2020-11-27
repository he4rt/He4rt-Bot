const Discord = require('discord.js');
const dedent = require('dedent');
const categories = require('../userCategory');

const linusSayingTalkIsCheap =
	'https://recruitingdaily.com/wp-content/uploads/sites/6/2017/02/quote-talk-is-cheap-show-me-the-code-linus-torvalds-45-66-13-e1487242875427.jpg';

module.exports = {
	run(client, message) {
		const mentionedUser = message.mentions.users.first();

		const answer = new Discord.RichEmbed()
			.setTitle('Não peça para perguntar')
			.setDescription(
				dedent`
				${mentionedUser ? `Ei ${mentionedUser}` : ''}
				Explique o problema
				Mostre o que você tentou
				Mostre o que deu errado
			`
			)
			.setImage(linusSayingTalkIsCheap)
			.setColor('#8146DC');

		message.channel.send(answer);
	},

	get command() {
		return {
			name: 'pergunte',
			category: categories.USER,
			description: 'Diz para o usuário não pedir para perguntar',
			usage: 'pergunte',
		};
	},
};
