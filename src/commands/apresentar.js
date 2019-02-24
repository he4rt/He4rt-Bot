const Discord = require('discord.js');

module.exports = {
  run: (client, message, args) => {
    message.delete().catch(O_o=>{});
    let presentedRole = client.guilds.get(process.env.GUILD_ID).roles.find('name', '🎓 Apresentou')
    if (!client.guilds.get(process.env.GUILD_ID).members.get(message.author.id).roles.exists('name', presentedRole.name)) {
      message.channel.send("``❕`` Todas as informações foram enviadas em seu privado.").then(msg => msg.delete(8000));
      return message.author.send("``❗`` Este é o nosso sistema de apresentação.\n\nResponda as perguntas com sinceridade total por sua pessoa.\nPara cancelar o envio, apenas ignore.\n\n``❗`` Para continuar digite ``!CONTINUAR`` aqui neste chat.")
    } else {
      return message.channel.send("``❌`` Você já se apresentou.").then(msg => msg.delete(8000));
    }
  },

  get command() {
    return {
      name: 'apresentar',
      category: 'Users',
      description: 'O usuario irá se apresentar.',
      usage: 'apresentar'
    }
  }
}
