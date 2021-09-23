const Discord = require('discord.js');
const categories = require('../userCategory');
const util = require('../util');

module.exports = {
	async run(client, message) {
		return message.channel.send(
			new Discord.RichEmbed()
				.setTitle(
					'``❗`` Processo seletivo da Juntos Somos Mais em parceria com He4rt Developers'
				)
				.setDescription(
					`Responda as perguntas com sinceridade total.
          Todas as informações desse questionário serão utilizadas pela Juntos Somos Mais durante a He4rt Conf ${util.getYear()}.

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
