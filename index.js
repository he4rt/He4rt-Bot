const Discord = require('discord.js');
const client = new Discord.Client();
const {promisify} = require('util');
const readdir = promisify(require('fs').readdir);
const Enmap = require('enmap')

client.commands = new Enmap()
require('dotenv').config()

const init = async () => {
  const cmdFiles = await readdir('./commands/')
  console.log('[#LOG]', `Carregando o total de ${cmdFiles.length} comandos.`)
  cmdFiles.forEach(f => {
    try {
      const props = require(`./commands/${f}`)
      if (f.split('.').slice(-1)[0] !== 'js') return
      if (props.init) {
        props.init(client)
      }
      client.commands.set(props.command.name, props)
    } catch (e) {
      console.log(`[#LOG] Impossivel executar comando ${f}: ${e}`)
    }
  })

const evtFiles = await readdir('./events/')
  console.log('[#LOG]', `Carregando o total de ${evtFiles.length} eventos.`)
  evtFiles.forEach(f => {
    const eventName = f.split('.')[0]
    const event = require(`./events/${f}`)

    client.on(eventName, event.bind(null, client))
  })

  client.on('error', (err) => {
    console.log('[#ERROR]', err)
  })

  client.login(process.env.AUTH_TOKEN);
  client.on('ready', () => client.user.setPresence({
    status: 'online',
    game: {
      name: 'a qualidade que você procura 💻 | heartdevs.com',
      type: 'STREAMING',
      url: 'https://www.twitch.tv/danielhe4rt'
    }
  }));
}
init();
