const Discord = require('discord.js');
const math = require('mathjs');
const categories = require('../userCategory');

module.exports = {
	validate(client, message, args) {
		if (args.join('') === '') {
			throw new Error('invalid_syntax');
		}
	},
	async run(client, message, args) {
		const question = args.join(' ');
		const answer = math.eval(question);

		const embed = new Discord.RichEmbed()
			.setTitle('``➗`` » !calcular')
			.setColor('#8146DC')
			.addField('**Cálculo:**', question)
			.addField('**Resposta:**', answer)
			.setFooter(
				`Comando utilizado por: ${message.author.tag}`,
				'https://i.imgur.com/14yqEKn.png'
			)
			.setTimestamp();
		return message.channel.send(embed);
	},

	get command() {
		return {
			name: 'calcular',
			category: categories.USER,
			description: 'Irá mostrar o avatar de um usuario.',
			usage: 'calcular',
		};
	},
};
