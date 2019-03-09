const { translate } = require('../util');

module.exports = {
  async run(client, message) {
    await message.delete();

    const member = message.mentions.users.first() || message.author;
    const answer = translate('avatar.answer');
    answer.setImage(member.avatarURL);
    await message.channel.send(answer);
  },

  get command() {
    return {
      name: 'avatar',
      category: 'Users',
      description: 'Irá mostrar o avatar de um usuario.',
      usage: 'avatar',
    };
  },
};
