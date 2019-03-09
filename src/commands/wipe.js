module.exports = {
  validate(client, message) {
    if (!message.member.hasPermission('MANAGE_GUILD')) {
      throw new Error('no_permission');
    }
  },
  async run(client, message) {
    const ids = client.guilds
      .get(process.env.GUILD_ID)
      .members.map(m => m.user.id);
    const { data } = await client.axios.post('/users/wipe', {
      discord_ids: ids,
    });

    message.channel.send('A porra do time acabou nessa porra');
    message.channel.send(`Usuários cadastrados: ${data.users}`);
  },

  get command() {
    return {
      name: 'wipe',
      category: 'Mods',
      description: 'api',
      usage: 'wipe',
    };
  },
};
