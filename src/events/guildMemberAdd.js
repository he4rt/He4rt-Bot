const Discord = require('discord.js');

module.exports = async (client, member) => {

	client.axios
		.post(`/users`, { discord_id: member.user.id })
		.catch(err => console.log(err));

	// Mandar DM pra pessoa que entrou

	member.send(
		':flag_br: Bem-vindo a He4rt, \n\n ▫ Leia o canal <#540992412793700382>;\n ▫ Descumprir as regras resultará em punições;\n ▫ Utilize ``!apresentar`` para facilitar a comunicação.\n\n``💡`` Não tenha medo de pedir ajuda, estamos aqui para ajudar e aprender.' +
			'\n\n' +
			":flag_us: Welcome to He4rt, \n\n ▫ Read the <#540992412793700382> channel;\n ▫ Breaking the rules will result in punishments;\n ▫ Use ``!apresentar`` to introduce and facilitate the communication.\n\n``💡`` Don't be afraid to ask for help, we're here to help and learn."
	);

	client.channels
		.get(process.env.WELCOME_CHAT)
		.send(`<:he4rt:546395281093034015> | ${member}`);
	client.channels
		.get(process.env.RULES_CHAT)
		.send(`<:he4rt:546395281093034015> | ${member}`)
		.then(msg => msg.delete(8000));
};
