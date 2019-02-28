module.exports = {
  validate(client, message) {
    const presentedRole = client.guilds
      .get(process.env.GUILD_ID)
      .roles.find(role => role.name === '🎓 Apresentou');
    if (
      client.guilds
        .get(process.env.GUILD_ID)
        .members.get(message.author.id)
        .roles.some(role => role.name === presentedRole.name)
    ) {
      throw new Error('registered');
    }
  },
  run(client, message) {
    message.channel
      .send('``❕`` Todas as informações foram enviadas em seu privado.')
      .then(msg => msg.delete(8000));
    return message.author.send(
      '``❗`` Este é o nosso sistema de apresentação.\n\nResponda as perguntas com sinceridade total por sua pessoa.\nPara cancelar o envio, apenas ignore.\n\n``❗`` Para continuar digite ``!CONTINUAR`` aqui neste chat.'
    );
  },

  get command() {
    return {
      name: 'apresentar',
      category: 'Users',
      description: 'O usuario irá se apresentar.',
      usage: 'apresentar',
    };
  },
};
