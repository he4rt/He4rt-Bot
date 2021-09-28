const { getYear } = require('../../');

const YEAR = getYear();

const sendInitialMessage = ({ message, messageGenerator }) =>
	message.author.send(
		messageGenerator
			.setTitle('Questionário da Juntos Somos Mais')
			.setDescription(
				`Vamos fazer algumas perguntas para te conhecer melhor.
        São 9 perguntinhas, sendo apenas uma dissertativa, é rapidinho!

        Todas as informações desse questionário serão enviadas ao time de People da Juntos Somos Mais, que poderá entrar em contato contigo através de DM no Discord durante a He4rt Conf ${getYear()} ou DM no LinkedIn após o evento.

        Para cancelar o envio, apenas ignore.`
			)
			.setFooter(
				`${YEAR} © He4rt Developers`,
				'https://i.imgur.com/14yqEKn.png'
			)
			.setTimestamp()
	);

const sendChannelMessage = ({ message, messageGenerator }) =>
	message.channel.send(
		messageGenerator
			.setTitle('Processo seletivo da Juntos Somos Mais')
			.setDescription(
				`Olá, ${message.author.username}!
          Agradecemos o interesse em participar do processo seletivo da Juntos Somos Mais na He4rt Conf 2021!

          Para continuar, te enviamos um questionário via DM no Discord.
          Por favor, responda o questionário para prosseguirmos!
          
          Até logo o/
        `
			)
			.setFooter(
				`${YEAR} © He4rt Developers`,
				'https://i.imgur.com/14yqEKn.png'
			)
			.setTimestamp()
	);

module.exports = {
	sendInitialMessage,
	sendChannelMessage,
};
