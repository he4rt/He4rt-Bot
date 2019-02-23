const Discord = require('discord.js');

module.exports = {
  run: (client, message, args) => {
    message.delete().catch((O_o) => {});

    if (!message.member.hasPermission('MANAGE_GUILD')) {
      return message.channel.send(
        '``❌`` Você não possui permissão para utilizar este comando. ``[MANAGE_GUILD]``',
      );
    }

    const mensg = args.slice(1).join(' ');
    const imageUrl = args[0];
    if (!mensg) return;
    if (!imageUrl) return;

    const announceImage = new Discord.RichEmbed()
      .setTitle('``🔔`` **Heart informa:**')
      .setDescription(mensg)
      .setImage(imageUrl)
      .setColor('#8146DC')
      .setFooter(
        '2019 © He4rt Developers',
        'https://heartdevs.com/wp-content/uploads/2018/12/logo.png',
      )
      .setTimestamp();

    return message.channel.send('<@&546333494654009345>', announceImage);
  },

  get command() {
    return {
      name: 'anunciar-img',
      category: 'Moderators',
      description: 'O usuario irá anunciar com imagem.',
      usage: 'anunciar-img',
    };
  },
};
