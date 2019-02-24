const Discord = require('discord.js');

module.exports = {
  run: (client, message, args) => {
    // TODO: verificar o que fazer com possivel erro
    message.delete().catch(() => {});

    if (!message.member.hasPermission('MANAGE_GUILD')) {
      return message.channel.send(
        '``❌`` Você não possui permissão para utilizar este comando. ``[MANAGE_GUILD]``'
      );
    }

    const mensg = args.slice(0).join(' ');
    if (!mensg) return null;

    const announce = new Discord.RichEmbed()
      .setTitle('``🔔`` **Heart informa:**')
      .setDescription(mensg)
      .setColor('#8146DC')
      .setFooter(
        '2019 © He4rt Developers',
        'https://heartdevs.com/wp-content/uploads/2018/12/logo.png'
      )
      .setTimestamp();

    return message.channel.send('@everyone', announce);
  },

  get command() {
    return {
      name: 'anunciar',
      category: 'Moderator',
      description: 'O usuario irá anunciar.',
      usage: 'anunciar',
    };
  },
};
