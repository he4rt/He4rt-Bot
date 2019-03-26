const util = require('../util');

const { filterChat } = require('../util/filter');

module.exports = async (client, message) => {
  if (message.author.bot) return null;

  if (message.content === '!join') {
		client.emit('guildMemberAdd', message.member || await message.guild.fetchMember(message.author));
	}

  filterChat(client, message);
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
    if (cmd.fail) {
      return cmd.fail(err, client, message, args);
    }
    const embed =
      util.embed(`${command}.fail.${err.message}`) ||
      util.embed(`${command}.fail.default`) ||
      util.embed(`error_command`, [command, err.message]);
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
