const Discord = require('discord.js');

module.exports = {
    run: (client, message, args) => {
      if (!message.member.hasPermission('MANAGE_GUILD')) {
        return message.channel.send(
          '``❌`` Você não possui permissão para utilizar este comando. ``[MANAGE_GUILD]``'
        );
      }

      const embedUnBan = new Discord.RichEmbed()
        .setTitle('``📌`` » !unban')
        .setDescription(
          'Para desbanir um usuário utilize:\n- ``!unban <@usuário> <motivo>``.'
        )
        .setColor('#ff1919')
        .setFooter(
          `Comando utilizado por: ${message.author.tag}`,
          'https://heartdevs.com/wp-content/uploads/2018/12/logo.png'
        )
        .setTimestamp();

      const user = args[0];
      if (!user) return message.reply(embedUnBan);

      const reason = args.slice(1).join(' ');
      if(!reason) return message.reply(embedUnBan);

      client.unbanReason = reason;
      client.unbanAuth = message.author;

      const embedUnPunish = new Discord.RichEmbed()
        .setTitle('``🚔`` » Revogou')
        .addField('``👤`` **Usuário desbanido:**', '<@' + user + '>', true)
        .addField('``👮`` **Desbanido por:**', message.author, true)
        .addField('``📄`` **Tipo:**', 'Banimento', true)
        .addField('``📣`` **Motivo:**', reason, true)
        .setColor('#00e500')
        .setFooter(
          '2019 © He4rt Developers',
          'https://heartdevs.com/wp-content/uploads/2018/12/logo.png'
        )
        .setTimestamp();

        message.guild.unban(user).catch((e) => {
                  if(e.code == "50035") {
                      message.channel.send('``❌`` Ocorreu um problema para punir este usuário.').then(msg => msg.delete(8000))
                  } else {console.error}
              });
        message.channel.send('``✅`` Usuário desbanido com sucesso.').then(msg => msg.delete(8000));
        client.channels.get(process.env.PUNISHMENTS_CHAT).send(embedUnPunish);
    },

    get command() {
        return {
            name: 'unban',
            category: 'Moderator',
            description: 'Comando para desbanir usuários pelo ID.',
            usage: 'unban',
        };
    },
};
