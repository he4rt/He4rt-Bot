module.exports = {
  async run(client, message, [state]) {
    message.delete();
    const SEND_MESSAGES = state === 'on';

    await message.channel.overwritePermissions(
      client.guilds.get(process.env.GUILD_ID).roles.find('name', '@everyone'),
      { SEND_MESSAGES }
    );
    await message.channel.overwritePermissions(
      client.guilds
        .get(process.env.GUILD_ID)
        .roles.find('id', process.env.MEMBER_ROLE),
      { SEND_MESSAGES }
    );
    if (SEND_MESSAGES) {
      await message.channel.send('``❗`` Este canal foi aberto.');
      await message.channel
        .send('``✅`` Canal aberto com sucesso.')
        .then(msg => msg.delete(8000));
    } else {
      await message.channel.send('``❗`` Este canal foi pausado.');
      await message.channel
        .send('``✅`` Canal pausado com sucesso.')
        .then(msg => msg.delete(8000));
    }
  },
  async validate(client, message, [state]) {
    if (!message.member.hasPermission('MANAGE_MESSAGES')) {
      throw new Error('no_permission');
    }
    if (!state) {
      throw new Error('no_state');
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
