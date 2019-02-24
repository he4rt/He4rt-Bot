const Discord = require('discord.js');

module.exports = {
  run: (client, message, args) => {
    message.delete().catch(() => {});

    const member = message.mentions.members.first();

    if (!message.member.hasPermission('KICK_MEMBERS')) {
      return message.channel.send(
        '``❌`` Você não possui permissão para utilizar este comando. ``[KICK_MEMBERS]``'
      );
    }

    const embedBan = new Discord.RichEmbed()
      .setTitle('``📌`` » !ban')
      .setDescription(
        'Para banir um usuário utilize:\n- ``!ban <nick> <motivo>``.'
      )
      .setColor('#ff1919')
      .setFooter(
        `Comando utilizado por: ${message.author.tag}`,
        'https://heartdevs.com/wp-content/uploads/2018/12/logo.png'
      )
      .setTimestamp();

    if(!member) return message.reply(embedBan).then(msg => msg.delete(8000));
    if(!member.bannable)
        return message.channel.send("``❌`` Ocorreu um problema para punir este usuário.").then(msg => msg.delete(8000));

    const reason = args.slice(1).join(' ');
    if(!reason) return message.reply(embedBan).then(msg => msg.delete(8000));

    member.ban(`Motivo: ` + reason + ` | Punido por: ${message.author.tag}`).catch(error => message.channel.send("``❌`` Ocorreu um problema para punir este usuário.").then(msg => msg.delete(8000)));

      const embedPunish = new Discord.RichEmbed()
        .setTitle('``🚔`` » Punição')
        .addField("``👤`` **Usuário punido:**", member.user, true)
        .addField("``👮`` **Punidor por:**", message.author, true)
        .addField("``📣`` **Motivo:**", reason, true)
        .setThumbnail(member.user.avatarURL)
        .setColor('#8146DC')
        .setFooter(
          '2019 © He4rt Developers',
          'https://heartdevs.com/wp-content/uploads/2018/12/logo.png'
        )
        .setTimestamp();

    client.channels.get("546143129749815306").send(embedPunish);

  },

  get command() {
    return {
      name: 'ban',
      category: 'Users',
      description: 'Irá mostrar o avatar de um usuario.',
      usage: 'ban',
    };
  },
};
