const { RichEmbed } = require('discord.js');

module.exports = {
  ch: [
    'CH ID',
    'CH ID'
  ],
  allowPath: /((twitch\.tv)|(youtube.com)|(github.com))/gi,
  regexPath: /((HTTPS:\/\/)|(HTTP:\/\/)|(www\.))/gi,
  regexPathV2: /((https:\/\/)|(http:\/\/)|(.)+((\.com)|(\.br)))/gi,
  regexBlock: /((covelign\.com)|(adf\.ly)|(xvideos)|(pornhub)|(bit\.ly)|(tinyurl\.))/gi,

  filtBan(name = '') {
    return new RichEmbed()
      .setTitle(` 📣 NOTICE `)
      .setColor('#8146DC')
      .addField(
        `DESCRIPTION ❗️`,
        `Toma BAN de gratis ai **${name}** otario BETA`
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
            17,
            25
          )} Hrs* **${name}** Evite restrições postando os links em 
          #links`
      )
      .setFooter(
        '2019 © He4rt Developers',
        'https://heartdevs.com/wp-content/uploads/2018/12/logo.png'
      )
      .setTimestamp();
  },
};
