const { RichEmbed } = require('discord.js');

module.exports = {
  ch: [
    '554016837671714827',
    '554042712710578178',
    '551276731131232257',
    '551277058047868950',
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
  filtAviso(name = '', min = 60000) {
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
          )} Hrs* **${name}** Evite restricoes postando os links em 
          #links BETA`
      )
      .setFooter(
        '2019 © He4rt Developers',
        'https://heartdevs.com/wp-content/uploads/2018/12/logo.png'
      )
      .setTimestamp();
  },
};
