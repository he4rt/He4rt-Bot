const Discord = require('discord.js');
const util = require('../util');

const runLevelUp = async (client, message) => {
	if (
		message.channel.type === 'dm' ||
		message.channel.id === process.env.COMMANDS_CHAT ||
		message.channel.id === process.env.GAMES_CHAT
	) {
		return;
	}
	const { data } = await client.axios.post(
		`/users/${message.author.id}/levelup`
	);
	if (!data.is_levelup) {
		return;
	}
	if (data.level === '10') {
		message.member.addRole(`547569615421833247`); // Iniciante
	}
	if (data.level === '20') {
		message.member.addRole(`547569827259088944`); // Intermediario
	}
	if (data.level === '30') {
		message.member.addRole(`547569825229307916`); // Avançado
	}
	if (data.level === '40') {
		message.member.addRole(`547569826324021248`); // Supremo
	}
	if (data.level === '50') {
		message.member.addRole(`512389942354378772`); // He4rt
	}
	const level = new Discord.RichEmbed()
		.setTitle(
			`🆙 **${message.author.username}** subiu para o nível ${
				data.level
			}!`
		)
		.setThumbnail(message.author.avatarURL)
		.setFooter(
			'2019 © He4rt Developers',
			'https://heartdevs.com/wp-content/uploads/2018/12/logo.png'
		)
		.setTimestamp();
	client.channels.get('552332704381927424').send(level);
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
	// if(message.channel.type !== "dm" && message.channel.id !== process.env.COMMANDS_CHAT && !message.member.roles.exists('id', process.env.ADMIN_ROLE) && message.channel.id !== process.env.COMMANDS_CHAT && !message.member.roles.exists('id', process.env.MOD_ROLE)) {
	//   message.delete().catch(() => {});
	//   return message.channel.send("``❌`` Use comandos no canal <#542840741588762637>.").then(msg => msg.delete(15000));
	// }
	if (!cmd) return;

	message.delete().catch(() => {});

	console.log(
		'[#LOG]',
		`${message.author.username} (${
			message.author.id
		}) executou o comando: ${cmd.command.name}`
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

	// if(!client.guilds
	//   .get(process.env.GUILD_ID)
	//   .members.get(message.member.id)
	//   .roles.has(process.env.APRESENTOU_ROLE)) {
	//   //chance de 10%
	//   let rdn = (Math.floor(Math.random() * 10)) + 1;
	//   if(rdn == 1) {
	//     message.member.send("``❗`` Utilize ``!apresentar`` para se apresentar para o servidor e desativar esta mensagem!");
	//   }
	// }

	const palavrasBanidas = [
		'preto',
		'fudido',
		'negro',
		'ddos',
		'macaco',
		'gorila',
		'picolé de asfalto',
		'baiano',
		'nordestino',
		'gordo',
		'vesgo',
		'piche',
		'maguila',
		'vadia',
		'puta',
		'piranha',
		'vagabunda',
		'fdp',
		'idiota',
		'desgraçado',
		'buceta',
		'bucetao',
		'gozar',
		'gozou',
		'gozada',
		'penis',
		'xoxota',
		'xota',
		'cacete',
		'cacetao',
		'rola',
		'fuder',
		'porra',
		'fude',
		'toma',
		'corno',
		'chifrudo',
		'chifre',
		'xifre',
		'caralho',
	];

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

	const msg = message.content.toLowerCase();
	// var Attachment = (message.attachments).array();

	// // Attachment.forEach(function(attachment) {
	// //   if(isImage(attachment.url)) {
	// //     console.log(isImage(attachment.url))
	// //     return client.channels.get('546136913699143691').send('imagem do crack')
	// //   } else {
	// //     return client.channels.get('546136913699143691').send('Desconhecido')
	// //   }
	// // })

	for (let x = 0; x < palavrasBanidas.length; x++) {
		if (msg.includes(palavrasBanidas[x])) {
			client.channels
				.get(process.env.REPORT_CHAT)
				.send(
					`<@&546333494654009345>\n\`\`[G-CHAT]\`\` Mensagem de ${
						message.author.username
					}: ${message.content} \`\`(${palavrasBanidas[x]} | ${
						message.channel.name
					})\`\``
				);
		}
	}

	await Promise.all([
		runLevelUp(client, message).catch(res =>
			console.error(`[#LEVELUP] ERROR: ${res}`)
		),
		runCommand(client, message),
	]);
	// await Promise.bind(runCommand(client, message));
};
