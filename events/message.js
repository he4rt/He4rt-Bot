module.exports = async (client, message) => {
  if (message.author.bot) return;

  if(message.channel.id == process.env.SUGGESTION_CHAT || message.channel.id == process.env.SEARCH_CHAT){
    message.react("✅");
    message.react("❌");
  }

  if (message.content.indexOf(process.env.COMMAND_PREFIX) !== 0) return

  const args = message.content.slice(process.env.COMMAND_PREFIX.length).trim().split(/ +/g)
  const command = args.shift().toLowerCase()

  const cmd = client.commands.get(command)
  if (!cmd) return

  console.log('[#LOG]', `${message.author.username} (${message.author.id}) executou o comando: ${cmd.command.name}`)
  cmd.run(client, message, args)
}
