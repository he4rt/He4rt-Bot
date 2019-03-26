const Discord = require('discord.js');

module.exports = {
  validate(client, message, args) {
    if (!message.member.hasPermission('MANAGE_GUILD')) {
      throw new Error('no_permission');
    }
  },
  async run(client, message, args) {
    const msg = args.slice(0).join(' ');
    
    if(!msg) {
        return message.reply(':x: Voce deve informar uma mensagem')
        .then(msg => msg.delete(5000))
        .catch(err => console.log(err));
    }

    message.channel.send(`${msg}`);
        
  },

  get command() {
    return {
      name: 'say',
      category: '??',
      description: '??',
      usage: 'say <msg>',
    };
  },
};
