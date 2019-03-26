const { RichEmbed } = require('discord.js');

module.exports = {
  timeUrls: {
    allow: 60000 * 30,
    default: 60000 * 5,
  },
  ch: [
    '554016837671714827',
    '554042712710578178',
    '551276731131232257',
    '554042712710578178',
  ],

  allowPath: /((twitch\.tv)|(youtube.com)|(github.com))/gi,
  regexPath: /((HTTPS:\/\/)|(HTTP:\/\/)|(www\.))/gi,
  regexPathV2: /((https:\/\/)|(http:\/\/)|(.)+((\.com)|(\.br)))/gi,
  regexBlock: /((covelign\.com)|(adf\.ly)|(adult\.)|(adult\.)|(bit\.ly)|(tinyurl\.))/gi,

  filtBan(name = '') {
    return new RichEmbed()
      .setTitle(` 📣 NOTICE `)
      .setColor('#8146DC')
      .addField(
        `DESCRIPTION ❗️`,
        `Caro Ex Membro da He4rt **${name}** você foi banido por agir em desacordo com as rules do DS da He4rt.`
      )
      .setFooter(
        '2019 © He4rt Developers',
        'https://heartdevs.com/wp-content/uploads/2018/12/logo.png'
      )
      .setTimestamp();
  },
  filtNotice(name = '', min = 60000) {
    return new RichEmbed()
      .setTitle(` 📣 NOTICE `)
      .setColor('#8146DC')
      .addField(
        `DESCRIPTION ❗`,
        `Esta Mensagem sera Deletada em *${new Date(min)
          .toGMTString()
          .slice(
            20,
            25
          )} Min* **${name}** Evite restrições postando os links em 
          #links`
      )
      .setFooter(
        '2019 © He4rt Developers',
        'https://heartdevs.com/wp-content/uploads/2018/12/logo.png'
      )
      .setTimestamp();
  },
  embedPunish(message) {
    return new RichEmbed()
      .setTitle('``🚔`` » Punição')
      .addField('``👤`` **Usuário punido:**', message.member.user, true)
      .addField('``👮`` **Punido por:**', `heartdevs.com ** *BOT* **`, true)
      .addField('``📄`` **Tipo:**', 'Banimento', true)
      .addField(
        '``📣`` **Motivo:**',
        `Post de urls Proibidas no canal **#${message.channel.name}**`,
        true
      )
      .setThumbnail(message.member.user.avatarURL)
      .setColor('#8146DC')
      .setFooter(
        '2019 © He4rt Developers',
        'https://heartdevs.com/wp-content/uploads/2018/12/logo.png'
      )
      .setTimestamp();
  },
};
