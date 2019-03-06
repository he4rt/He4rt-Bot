const Discord = require('discord.js');

module.exports = {
  run: (client, message, args) => {
    const ids = client.guilds.get(process.env.GUILD_ID).members.map(m => m.user.id)
    client.axios.post('/users/wipe',{
      discord_ids : ids
    })
    .then(res => {
      message.channel.send("A porra do time acabou nessa porra")
      message.channel.send("Usuários cadastrados: " + res.data.users)
    })
    .catch(err => console.log(err));
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
