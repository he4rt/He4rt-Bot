const Discord = require('discord.js');

module.exports = {
  run: (client, message, args) => {
    message.delete().catch(() => {});

    message.channel.send("``📡`` Latência da API: " + Math.round(client.ping) + "ms.");
  },

  get command() {
    return {
      name: 'ping',
      category: 'Users',
      description: 'Comando de ping(latência)',
      usage: 'avatar',
    };
  },
};
