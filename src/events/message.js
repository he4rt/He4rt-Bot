const Discord = require('discord.js');
const util = require('../util');

const runLevelUp = async (client, message) => {
  const { data } = await client.axios.post(
    `/users/${message.author.id}/levelup`
  )
  if (!data.is_levelup) {
    return;
  }
  const level = new Discord.RichEmbed()
    .setTitle(
      `🆙 **${message.author.username}** subiu para o nível ${data.level}!`
    )
    .setThumbnail(message.author.avatarURL)
    .setFooter(
      '2019 © He4rt Developers',
      'https://heartdevs.com/wp-content/uploads/2018/12/logo.png'
    )
    .setTimestamp();
  client.channels
    .get("552332704381927424")
    .send(level)
  console.log(
    '[#LOG]',
    `${message.author.username} subiu para o nível ${data.level}!`
  );
};
const runCommand = async (client, message) => {
  if (
    message.channel.id === process.env.SUGGESTION_CHAT ||
    message.channel.id === process.env.SEARCH_CHAT
  ) {
    message.react('✅');
    message.react('❌');
  }
  if (!util.isCommand(message)) return;

  const args = message.content
    .slice(process.env.COMMAND_PREFIX.length)
    .trim()
    .split(/ +/g);
  const command = args.shift().toLowerCase();

  const cmd = client.commands.get(command);
  if (!cmd) return;

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
    if (cmd.success) {
      await cmd.success(client, message, args);
    }
  } catch (err) {
    console.error(err);
    if (cmd.fail) {
      await cmd.fail(err, client, message, args);
      return;
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
    await message.reply(embed).then(msg => msg.delete(15000));
    return;
  } finally {
    if (cmd.after) {
      await cmd.after(client, message, args);
    }
  }
};

module.exports = async (client, message) => {
  if (message.author.bot) return;

  await Promise.all([runLevelUp(client, message).catch(res => console.log(res)), runCommand(client, message)]);
};
