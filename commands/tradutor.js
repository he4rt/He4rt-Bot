const Discord = require('discord.js');
const translate = require('@vitalets/google-translate-api');

module.exports = {
  run: (client, message, args) => {
    let txt = args.join(" ");

    translate(txt, {to: 'pt'}).then(res => {
      const translate = new Discord.RichEmbed()
        .setTitle("``📡`` » !traduzir")
        .setColor("#8146DC")
        .addField("**Tradução:**", res.text)
        .addField("**Idioma:**", res.from.language.iso)
        .setFooter("Comando utilizado por: " + message.author.tag, "https://heartdevs.com/wp-content/uploads/2018/12/logo.png")
        .setTimestamp()
        message.channel.send(translate);
    }).catch(err => {console.log(err);});
  },

  get command() {
    return {
      name: 'traduzir',
      category: 'Users',
      description: 'Sistema de tradução.',
      usage: 'traduzir'
    }
  }

}
