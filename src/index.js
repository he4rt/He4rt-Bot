const Discord = require('discord.js');
const fs = require('fs-extra');
const Enmap = require('enmap');
const tmi = require('tmi.js');
const _ = require('lodash');
const sqlite3 = require('sqlite3').verbose();
const client = new Discord.Client();

client.db = new sqlite3.Database('assets/curiosidades.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('[Connected to the database.]');
  }
});



const options = {
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

const twitchclient = new tmi.client(options);

client.commands = new Enmap();
require('dotenv').config();

const TWITCH_CHANNEL = ['danielhe4rt'];

const init = async () => {
  const cmdFiles = await fs.readdir('src/commands/');
  console.log('[#LOG]', `Carregando o total de ${cmdFiles.length} comandos.`);
  cmdFiles.forEach(f => {
    try {
      // eslint-disable-next-line
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
  
  const evtFiles = await fs.readdir('src/events/');
  console.log('[#LOG]', `Carregando o total de ${evtFiles.length} eventos.`);
  evtFiles.forEach(f => {
    const eventName = f.split('.')[0];
    // eslint-disable-next-line
    const event = require(`./events/${f}`);
    
    client.on(eventName, event.bind(null, client));
  });
  
  client.on('error', err => console.error('[#ERROR]', err));
  
  client.login(process.env.AUTH_TOKEN);
};
init();
twitchclient.connect();

twitchclient.on('connected', (address, port) => {
  console.log('[#TWITCH]', `Conectado com sucesso! ${address}:${port}`);
});

let laststatus = 'default';
function runChannels() {
  const promises = TWITCH_CHANNEL.map(
    channelname =>
    new Promise(resolve => {
      twitchclient.api(
        {
          url: `https://api.twitch.tv/kraken/streams/${channelname}`,
          headers: {
            'Client-ID': process.env.TWITCH_APP_CLIENT_ID,
          },
        },
        (err, res, body) => {
          /* TODO: tratar esse erro
          if (err) {
            return reject(err);
          }
          */
          resolve(body.stream == null ? 'offline' : 'online');
        }
        );
      })
      );
      
      Promise.all(promises).then(
        results => {
          if (_.indexOf(results, 'online') !== -1) {
            if (laststatus !== 'online') {
              const liveEmbed = new Discord.RichEmbed()
              .setTitle('<:he4rt:546395281093034015> **He4rt informa:**')
              .setDescription(
                '[A live do DanielHe4rt está online na twitch!](https://www.twitch.tv/danielhe4rt)'
                )
                .setColor('#8146DC')
                .setImage(
                  'http://static-cdn.jtvnw.net/previews-ttv/live_user_danielhe4rt-1920x1080.jpg' 
                  )
                  .setFooter(
                    '2019 © He4rt Developers',
                    'https://heartdevs.com/wp-content/uploads/2018/12/logo.png'
                    )
                    .setTimestamp();
                    
                    client.channels
                    .get(process.env.ANNOUNCEMENT_CHAT)
                    .send('<:he4rt:546395281093034015> | @everyone', liveEmbed);
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
                } else if (laststatus !== 'offline') {
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
              },
              err => console.log(err)
              );
            }
            setInterval(runChannels, process.env.CHECK_INTERVAL);
            