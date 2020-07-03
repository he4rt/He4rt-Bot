const Discord = require('discord.js');
const util = require('../util');

const runCommand = async (client, message) => {
	if (message.channel.id === process.env.SUGGESTION_CHAT) {
		await message.react('✅');
		await message.react('❌');
	}

	if (!util.isCommand(message)) return;

	const args = message.content
		.slice(process.env.COMMAND_PREFIX.length)
		.trim()
		.split(/ +/g);
	const command = args.shift().toLowerCase();

	const cmd = client.commands.get(command);
	if (!cmd) return;

	message.delete().catch(() => {});

	console.log(
		'[#LOG]',
		`${message.author.username} (${message.author.id}) executou o comando: ${cmd.command.name}`
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
			embed.setTitle(
				`\`\`❌\`\` » ${process.env.COMMAND_PREFIX}${command}`
			);
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

	if (message.content.toLowerCase() === 'boa noite') {
		message.react('💤');
		message.channel.send('noite!');
	}
	if (message.content.toLowerCase() === 'bom dia') {
		message.react('🌅');
		message.channel.send('dia!');
	}
	if (message.content.toLowerCase() === 'boa tarde') {
		message.react('🌞');
		message.channel.send('tarde!');
	}

	await Promise.bind(runCommand(client, message));
};
