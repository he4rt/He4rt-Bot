const util = require('../util');

module.exports = async (client, message) => {
  if (message.author.bot) return null;
  client.axios.post('/users/'+message.author.id+'/levelup')
  .then(res => {
    console.log(res.data)
    if(res.data.is_levelup){
      //mandar um rich-embed num canal qualquer
      console.log(message.author.username,": Upou")
    }else{
      console.log(message.author.username,": Não upou")
    }
  })
  .catch(function (error) {
    console.log(error);
  });
  
  if (
    message.channel.id === process.env.SUGGESTION_CHAT ||
    message.channel.id === process.env.SEARCH_CHAT
  ) {
    message.react('✅');
    message.react('❌');
  }
  if (!util.isCommand(message)) return null;

  const args = message.content
    .slice(process.env.COMMAND_PREFIX.length)
    .trim()
    .split(/ +/g);
  const command = args.shift().toLowerCase();

  const cmd = client.commands.get(command);
  if (!cmd) return null;

  console.log(
    '[#LOG]',
    `${message.author.username} (${message.author.id}) executou o comando: ${
      cmd.command.name
    }`
  );
  try {
    if (cmd.validate) {
      await cmd.validate(client, message, args);
    }
    await cmd.run(client, message, args);
  } catch (err) {
    console.error(err)
    if (cmd.fail) {
      return cmd.fail(err, client, message, args);
    }
    const embed =
      util.translate(`${command}.fail.${err.message}`) ||
      util.translate(`${command}.fail.default`) ||
      util.translate(`error_command`, [command, err.message]);
    if (!embed.title) {
      embed.setTitle(`\`\`❌\`\` » ${process.env.COMMAND_PREFIX}${command}`);
    }
    if (!embed.color) {
      embed.setColor('#36393E');
    }
    return message.reply(embed).then(msg => msg.delete(15000));
  } finally {
    if (cmd.after) {
      await cmd.after(client, message, args);
    }
  }
  if (cmd.success) {
    await cmd.success(client, message, args);
  }
};
