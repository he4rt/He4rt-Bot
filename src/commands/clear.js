const { translate } = require('../util');
const Discord = require("discord.js");


module.exports = {
    validate(client, message, args) {
    if (!message.member.hasPermission('MANAGE_GUILD')) {
            throw new Error('no_permission');
        }
    },

    async run(client, message, args) {

        if(parseInt(args[0]) < 1 || args[0] == "" || args[0] == " " || args[0] == null) {
            return;
        }


        if(parseInt(args[0]) > 100) {
            return;
        }

        let number = parseInt(args[0]);
        message.channel.fetchMessages({limit: number}).then(messages => message.channel.bulkDelete(messages));
    },

  get command() {
    return {
      name: 'clear',
      category: 'mod',
      description: 'Irá limpar o chat',
      usage: 'clear <qtd>',
    };
  },
};
