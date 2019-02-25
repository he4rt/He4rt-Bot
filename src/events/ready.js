const util = require('../util');

module.exports = async (client, message) => {
  client.user.setPresence({
    status: 'online',
    game: {
      name: 'a qualidade que você procura 💻 | heartdevs.com',
      type: 'STREAMING',
      url: 'https://www.twitch.tv/danielhe4rt',
    },
  });

  // polling do tempban
  const guild = client.guilds.get(process.env.GUILD_ID);
  setInterval(() => {
    client.rest.methods
      .getGuildBans(guild)
      .then(bans =>
        bans.forEach(ban => {
          // timestanp do cara banido
          const timeStampBanido = ban.reason
            .toString()
            .split(' ')[0]
            .replace('[', '')
            .replace(']', '');

          // Se o timestanp do cara banido for maior que o atual
          if (Date.now() > timeStampBanido) {
            guild
              .unban(ban.user.id)
              .then(() =>
                console.log(`Usuario desbanido (tempban): ${ban.user.id}`)
              )
              .catch(console.error);
          }
        })
      )
      .catch(console.erro);
  }, 60000); // verifica a cada 1mim
};
