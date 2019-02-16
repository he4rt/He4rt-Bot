const Discord = require('discord.js');

module.exports = {
  run: (client, message, args) => {
    message.delete().catch(O_o=>{});

      let mensg = args.slice(0).join(' ');
      if(!mensg) return;

      const announce = new Discord.RichEmbed()
        .setTitle("``🔔`` **Heart informa:**")
        .setDescription(mensg)
        .setColor("#8146DC")
        .setFooter("2019 © He4rt Developers", "https://heartdevs.com/wp-content/uploads/2018/12/logo.png")
        .setTimestamp()

       return message.channel.send("<@&546333494654009345>", announce)
  },

  get command() {
    return {
      name: 'anunciar',
      category: 'Moderator',
      description: 'O usuario irá anunciar.',
      usage: 'anunciar'
    }
  }
}
