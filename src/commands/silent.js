const { translate } = require('../util');

const { NOTIFY_ROLE } = process.env;

module.exports = {
  async run(client, message) {

    const hasRole = !message.member.roles.exists('id', NOTIFY_ROLE);
    const answer = translate(`silent.${hasRole ? 'disable' : 'enable'}`);
    if (hasRole) {
      await message.member.addRole(NOTIFY_ROLE);
    } else {
      await message.member.removeRole(NOTIFY_ROLE);
    }
    return message.channel.send(answer);
  },

  get command() {
    return {
      name: 'silent',
      category: 'Users',
      description: 'Desativar mensagens da equipe.',
      usage: 'silent',
    };
  },
};
