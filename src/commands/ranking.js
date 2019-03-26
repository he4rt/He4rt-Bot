const Discord = require('discord.js');

module.exports = {
  async run(client, message, args) {
    const page = args[0] ? +args[0] : 1;
    if (!page || page < 1) {
      return message.channel.send('Tem q ser maior ou igual a 1');
    }

    let count = page || 0;
    count *= 10;
    const { data: ranking } = await client.axios.get(`/ranking?page=${page}`);
    if (!ranking.data[0]) {
      return message.channel.send('Essa pagina nao existe');
    }

    const value = ranking.data.map((rank, i) => {
      const { user } = client.guilds
        .get(process.env.GUILD_ID)
        .members.get(rank.discord_id);
      return `${1 + i + (count - 10)} | ${user.username} | Level: ${
        rank.level
      } | Exp: ${rank.current_exp}`;
    });

    const embed = new Discord.RichEmbed()
      .setTitle('``🏆`` » !ranking')
      .addField(`Pagina #${page} de ${ranking.last_page}`, value, true)
      .setTimestamp();
    await message.channel.send({ embed });

  },

  get command() {
    return {
      name: 'ranking',
      category: 'Users',
      description: 'Lista o mapeamento dos usuários mais ativos',
      usage: 'avatar',
    };
  },
};
