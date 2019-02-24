const util = require('../util');

module.exports = async (client, message) => {
  if (message.author.bot) return null;

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
    await cmd.run(client, message, args);
  } catch (err) {
    if (cmd.fail) {
      return cmd.fail(err, client, message, args);
    }
  } finally {
    if (cmd.after) {
      await cmd.after(client, message, args);
    }
  }
  if (cmd.success) {
    await cmd.success(client, message, args);
  }
};
