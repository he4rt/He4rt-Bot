const Discord = require('discord.js');

module.exports = {
  async validate(client, message, args) {
    if (!message.member.hasPermission('MANAGE_GUILD')) {
      throw new Error('no_permission');
    }
  },
  run: (client, message, args) => {
    var id = Math.floor(Math.random() * 90000) + 10000;
    const member = message.mentions.users.first()

    const embedSugesAn = new Discord.RichEmbed()
      .setTitle('``📊`` » Sugestões')
      .addField('``👤`` **Sugestão de:**', member.username, true)
      .addField('``🆔`` **ID:**', '#' + id, true)
      .addField('``📄`` **Sugestão:**', args[3], true)
      .addField('``📄`` **Status:**', ':warning: Sugestão está sendo analisado por nossa equipe de administração ou desenvolvimento.', true)
      .setColor('#ffff32')
      .setFooter(
        '2019 © He4rt Developers',
        'https://heartdevs.com/wp-content/uploads/2018/12/logo.png'
      )
      .setTimestamp();

    const embedSugesDen = new Discord.RichEmbed()
      .setTitle('``📊`` » Sugestões')
      .addField('``👤`` **Sugestão de:**', member.username, true)
      .addField('``🆔`` **ID:**', '#' + id, true)
      .addField('``📄`` **Sugestão:**', args[3], true)
      .addField('``📄`` **Status:**', ':x: Infelizmente esta sugestão não foi aceita por nossa equipe.', true)
      .setColor('#ff3232')
      .setFooter(
        '2019 © He4rt Developers',
        'https://heartdevs.com/wp-content/uploads/2018/12/logo.png'
      )
      .setTimestamp();

    const embedSugesAcc = new Discord.RichEmbed()
      .setTitle('``📊`` » Sugestões')
      .addField('``👤`` **Sugestão de:**', member.username, true)
      .addField('``🆔`` **ID:**', '#' + id, true)
      .addField('``📄`` **Sugestão:**', args[3], true)
      .addField('``📄`` **Status:**', ':white_check_mark: Sugestão aceita passará por uma análise final para um melhor aproveitamento de sua utilização.', true)
      .setColor('#4ca64c')
      .setFooter(
        '2019 © He4rt Developers',
        'https://heartdevs.com/wp-content/uploads/2018/12/logo.png'
      )
      .setTimestamp();
    

    if(args[0] == "aceitar" || args[0] == "negar" || args[0] == "analise") {
        if(!member) {
          return
        }
    
        if(!args[3]) {
          return
        }
        if(args[0] == 'aceitar') {
          client.channels.get(process.env.SUGGESTION_STATS).send(embedSugesAcc)
        }
        if(args[0] == 'negar') {
          client.channels.get(process.env.SUGGESTION_STATS).send(embedSugesDen)
        } 
        if(args[0] == 'analise') {
          client.channels.get(process.env.SUGGESTION_STATS).send(embedSugesAn)
        }
        return;
    }
    return message.reply('Argumento invalido');

  },

  get command() {
    return {
      name: 'suges',
      category: 'Administrator',
      description: 'Comando para aceitar/negar sugestões.',
      usage: 'suges',
    };
  },
};
