const cooldownError = ({ err, message, discordText }) => {
	if (err.message === 'cooldown') {
		const cooldownEmbed = discordText
			.setTitle(
				'``❌`` **Você já utilizou este comando, verifique sua DM para mais informações.**'
			)
			.setColor('#36393E');
		return message.channel
			.send(cooldownEmbed)
			.then(msg => msg.delete(8000));
	}
};

const dmDisabledError = ({ message, discordText }) => {
	const dmDisabled = discordText
		.setTitle('``❌`` **Sua DM do Discord está fechada.**')
		.setDescription(
			`Ops, parece que sua DM do Discord está fechada e não foi possível enviar mensagem.
      Por favor, libere sua DM para receber mensagens e execute o comando novamente`
		)
		.setColor('#36393E');
	return message.channel.send(dmDisabled).then(msg => msg.delete(8000));
};

const alreadyAnsweredError = ({ message }) =>
	message.channel
		.send('``❌`` Você já respondeu esse fomulário.')
		.then(msg => msg.delete(10000));

const timeoutError = ({ message, discordText }) => {
	const timeout = discordText
		.setTitle('``❌`` **Tempo limite de resposta excedido.**')
		.setDescription(
			'Para enviar as respostas será necessário executar o comando `!juntos` novamente.'
		)
		.setColor('#36393E');
	return message.author.send(timeout);
};

module.exports = {
	alreadyAnsweredError,
	cooldownError,
	dmDisabledError,
	timeoutError,
};
