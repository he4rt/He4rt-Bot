const Discord = require('discord.js');

module.exports = {
  run: (client, message, args) => {

    let member = message.mentions.users.first() || message.author;
     const avatar = new Discord.RichEmbed()
       .setTitle("``🖼️`` » !avatar")
       .setDescription("**[Clique aqui](" + member.avatarURL + ")** para baixar a imagem!")
       .setImage(member.avatarURL)
       .setColor("#8146DC")
       .setFooter("Comando utilizado por: " + message.author.tag, "https://heartdevs.com/wp-content/uploads/2018/12/logo.png")
       .setTimestamp()
     message.channel.send(avatar)
  },

  get command() {
    return {
      name: 'avatar',
      category: 'Users',
      description: 'Irá mostrar o avatar de um usuario.',
      usage: 'avatar'
    }
  }

}
