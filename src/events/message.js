const Discord = require('discord.js');
const util = require('../util');
const antiScam = require('../util/anti_scam');

const runLevelUp = async (client, message) => {
	if (
		message.channel.type === 'dm' ||
		message.channel.id === process.env.COMMANDS_CHAT ||
		message.channel.id === process.env.GAMES_CHAT
	) {
		return;
	}
	const donator = message.member.roles.find(
		r => r.id === process.env.DONATOR_ROLE
	);

	console.log({
		discord_id: message.author.id,
		message: message.content,
		donator: false,
	});

	const { data } = await client.axios.post(`bot/gamification/levelup`, {
		discord_id: message.author.id,
		message: message.content,
		donator: false,
	});

	if (!data.is_levelup) return; // Check if is level up

	const lvl = parseInt(data.level, 10);

	if (lvl === 10) {
		message.member.addRole(process.env.BEGINNER_ROLE); // Iniciante
	}
	if (lvl === 20) {
		message.member.addRole(process.env.INTERMEDIATE_ROLE); // Intermediario
	}
	if (lvl === 30) {
		message.member.addRole(process.env.ADVANCED_ROLE); // Avançado
	}
	if (lvl === 40) {
		message.member.addRole(process.env.SUPREME_ROLE); // Supremo
	}
	if (lvl === 50) {
		message.member.addRole(process.env.HE4RT_ROLE); // He4rt
	}

	const level = new Discord.RichEmbed()
		.setTitle(
			`🆙 **${message.author.username}** subiu para o nível ${data.level}!`
		)
		.setColor('#4c4cff')
		.setThumbnail(message.author.avatarURL)
		.setFooter(
			`${util.getYear()}© He4rt Developers`,
			'https://i.imgur.com/14yqEKn.png'
		)
		.setTimestamp();
	// client.channels.get('552332704381927424').send(level);
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
	// if(message.channel.type !== "dm" && message.channel.id !== process.env.COMMANDS_CHAT && !message.member.roles.exists('id', process.env.ADMIN_ROLE) && message.channel.id !== process.env.COMMANDS_CHAT && !message.member.roles.exists('id', process.env.MOD_ROLE)) {
	//   message.delete().catch(() => {});
	//   return message.channel.send("``❌`` Use comandos no canal <#542840741588762637>.").then(msg => msg.delete(15000));
	// }
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

	if (antiScam.containsScamLink(message.content)) {
		console.info(
			`deleting message that contains scam link. author=${message.author.username}`
		);

		await Promise.all([
			message.channel.send(`
${message.author} sua mensagem foi deletada por conter um link banido.
Se acha que isso é um erro, contate alguém da staff.`),
			message.delete(),
		]);

		return;
	}

	await Promise.all([
		runLevelUp(client, message).catch(res =>
			console.error(`[#LEVELUP] ERROR: ${res}`)
		),
		runCommand(client, message),
	]);
	// await Promise.bind(runCommand(client, message));
};
