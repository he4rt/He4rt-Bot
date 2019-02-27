const Discord = require('discord.js');

module.exports = {
  run: (client, message, args) => {
    message.delete().catch(() => {});

    
    //Verificacao de permissão
    if (!message.member.hasPermission('MANAGE_MESSAGES')) {
        return message.channel.send(
          '``❌`` Você não possui permissão para utilizar este comando. ``[MANAGE_MESSAGES]``'
        );
    }

    if(!args[0]) {
        const embedChat = new Discord.RichEmbed()
      .setTitle('``📌`` » !chat')
      .setDescription(
        'Para ativar ou pausar o chat utilize:\n- ``!chat on``;\n- ``!chat off``.'
      )
      .setColor('#ff1919')
      .setFooter(
        `Comando utilizado por: ${message.author.tag}`,
        'https://heartdevs.com/wp-content/uploads/2018/12/logo.png'
      )
      .setTimestamp();

      message.reply(embedChat);
    }

    if(args[0] == "on") {
        //Abre o chat
        message.channel.overwritePermissions(client.guilds.get(process.env.GUILD_ID).roles.find('name', "@everyone"), {
            "SEND_MESSAGES" : true
        })
        message.channel.overwritePermissions(client.guilds.get(process.env.GUILD_ID).roles.find("id", process.env.MEMBER_ROLE), {
            "SEND_MESSAGES" : true
        });
        message.channel.send("``❗`` Este canal foi aberto.");
        message.channel.send("``✅`` Canal aberto com sucesso.").then(msg => msg.delete(8000));
    } else if(args[0] == "off") {
        //Fecha o chat
        message.channel.overwritePermissions(client.guilds.get(process.env.GUILD_ID).roles.find('name', "@everyone"), {
            "SEND_MESSAGES" : false
        });
        message.channel.overwritePermissions(client.guilds.get(process.env.GUILD_ID).roles.find("id", process.env.MEMBER_ROLE), {
            "SEND_MESSAGES" : false
        });
        message.channel.send("``❗`` Este canal foi pausado.");
        message.channel.send("``✅`` Canal pausado com sucesso.").then(msg => msg.delete(8000));
    }
  },

  get command() {
    return {
      name: 'chat',
      category: 'Moderator',
      description: 'Usuário irá ativar/desativar o chat.',
      usage: 'chat',
    };
  },
};
