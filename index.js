const Discord = require('discord.js');

const client = new Discord.Client();
const { promisify } = require('util');
const readdir = promisify(require('fs').readdir);
const Enmap = require('enmap');
const tmi = require('tmi.js');
const _ = require('lodash');

const twitchclient = new tmi.client(options);

client.commands = new Enmap();
require('dotenv').config();

const TWITCH_CHANNEL = ['danielhe4rt'];

var options = {
  options: {
    debug: false,
  },
  connection: {
    reconnect: true,
  },
  identity: {
    username: process.env.TWITCH_BOT_USERNAME,
    password: process.env.TWITCH_BOT_PASSWORD,
  },
  channels: [`#${process.env.TWITCH_BOT_USERNAME}`],
};

const init = async () => {
  const cmdFiles = await readdir('./commands/');
  console.log('[#LOG]', `Carregando o total de ${cmdFiles.length} comandos.`);
  cmdFiles.forEach((f) => {
    try {
      const props = require(`./commands/${f}`);
      if (f.split('.').slice(-1)[0] !== 'js') return;
      if (props.init) {
        props.init(client);
      }
      client.commands.set(props.command.name, props);
    } catch (e) {
      console.log(`[#LOG] Impossivel executar comando ${f}: ${e}`);
    }
  });

  const evtFiles = await readdir('./events/');
  console.log('[#LOG]', `Carregando o total de ${evtFiles.length} eventos.`);
  evtFiles.forEach((f) => {
    const eventName = f.split('.')[0];
    const event = require(`./events/${f}`);

    client.on(eventName, event.bind(null, client));
  });

  client.on('error', (err) => {
    console.log('[#ERROR]', err);
  });

  client.login(process.env.AUTH_TOKEN);
  client.on('ready', () => client.user.setPresence({
    status: 'online',
    game: {
      name: 'a qualidade que você procura 💻 | heartdevs.com',
      type: 'STREAMING',
      url: 'https://www.twitch.tv/danielhe4rt',
    },
  }));
};
init();
twitchclient.connect();

twitchclient.on('connected', (address, port) => {
  console.log('[#TWITCH]', 'Conectado com sucesso!');
});

setInterval(runChannels, process.env.CHECK_INTERVAL);
let laststatus = 'default';
function runChannels() {
  const promises = [];
  for (var i = 0, len = TWITCH_CHANNEL.length; i < len; i++) {
    promises.push(new Promise(((resolve, reject) => {
      const channelname = TWITCH_CHANNEL[i];
      twitchclient.api({
        url: `https://api.twitch.tv/kraken/streams/${channelname}`,
        headers: {
          'Client-ID': process.env.TWITCH_APP_CLIENT_ID,
        },
      }, (err, res, body) => {
        if (body.stream == null) {
          result = 'offline';
        } else {
          result = 'online';
        }
        resolve(result);
      });
    })));
  }

  Promise.all(promises).then((results) => {
    if (_.indexOf(results, 'online') != (-1)) {
      if (laststatus != 'online') {
        const liveEmbed = new Discord.RichEmbed()
          .setTitle('<:he4rt:546395281093034015> **He4rt informa:**')
          .setDescription('[A live do DanielHe4rt está online na twitch!](https://www.twitch.tv/danielhe4rt)')
          .setColor('#8146DC')
          .setImage('https://static-cdn.jtvnw.net/previews-ttv/live_user_danielhe4rt-1920x1080.jpg')
          .setFooter('2019 © He4rt Developers', 'https://heartdevs.com/wp-content/uploads/2018/12/logo.png')
          .setTimestamp();

        client.channels.get(process.env.ANNOUNCEMENT_CHAT).send('<:he4rt:546395281093034015> | @everyone', liveEmbed);
        // client.user.setPresence({
        // status: 'online',
        // game: {
        // name: '🔔 DanielHe4rt está online na Twitch!',
        // type: 'STREAMING',
        // url: 'https://www.twitch.tv/danielhe4rt'
        // }
        // });
        laststatus = 'online';
      }
    } else if (laststatus != 'offline') {
      // client.user.setPresence({
      // status: 'online',
      // game: {
      // name: 'a qualidade que você procura 💻 | heartdevs.com',
      // type: 'STREAMING',
      // url: 'https://www.twitch.tv/danielhe4rt'
      // }
      // });
      laststatus = 'offline';
    }
  }, (err) => {
    console.log(err);
  });
}
