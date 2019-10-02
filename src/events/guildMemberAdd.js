const Discord = require('discord.js');

module.exports = async (client, member) => {
	client.axios
		.post(`/users`, { discord_id: member.user.id })
		.catch(err => console.log(err.response.data));

	// Mandar DM pra pessoa que entrou

	member.send(
		`:flag_br: Bem-vindo a **He4rt Developers**!\n\n:white_small_square: Nós somos uma comunidade de auxilio a desenvolvedores e entusiastas com o intuito de proporcionar um networking entre os participantes desta comunidade;\n:white_small_square: É iniciante? Sem problemas, utilize os canais de ajuda e também visualize os tutoriais disponíveis em \n:white_small_square: Nossa intuição é sempre ajudar, você pode tanto contribuir quanto pedir ajuda, não precisa ter vergonha somos todos uma comunidade, nos visamos sempre ajudar o próximo, tanto a conseguir emprego, quanto com duvidas, quanto com a amizade! \n:white_small_square: Use \`!jobs\` para receber propostas de empregos especiais! :programathor:\n\n:exclamation: Você pode se apresentar utilizando o comando \`!apresentar\`, com isto toda a comunidade pode ter noção de quem você é, lembre-se que é **OPCIONAL** se identificar realmente, nesta seção você poderá selecionar também as linguagens que você gostaria de aprender ou trabalhar, além do acesso ao chat de ajuda das mesmas.`
	);

	client.channels
		.get(process.env.WELCOME_CHAT)
		.send(`<:he4rt:629035176755724299> | ${member}`);
	client.channels
		.get(process.env.RULES_CHAT)
		.send(`<:he4rt:629035176755724299> | ${member}`)
		.then(msg => msg.delete(8000));
};
