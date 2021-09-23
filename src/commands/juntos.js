const Discord = require('discord.js');
const categories = require('../userCategory');
const util = require('../util');

module.exports = {
	async run(client, message) {
		return message.channel.send(
			new Discord.RichEmbed()
				.setTitle('Processo seletivo da Juntos Somos Mais')
				.setDescription(
					`Vamos fazer algumas perguntas para te conhecer melhor.
          São 9 perguntinhas, sendo apenas uma dissertativa, é rapidinho!

          Todas as informações desse questionário serão enviadas ao time de People da Juntos Somos Mais, que poderá entrar em contato contigo através de DM no Discord durante a He4rt Conf ${util.getYear()} ou DM no LinkedIn após o evento.

          Para cancelar o envio, apenas ignore.`
				)
				.setFooter(
					`${util.getYear()} © He4rt Developers`,
					'https://i.imgur.com/14yqEKn.png'
				)
				.setTimestamp()
		);
	},

	get command() {
		return {
			name: 'juntos',
			category: categories.USER,
			description:
				'Questionário para participação no processo seletivo da Juntos Somos Mais em parceria com He4rt Developers',
			usage: 'juntos',
		};
	},
};
