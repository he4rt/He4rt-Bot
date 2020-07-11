const { promisify } = require('util');
const Discord = require('discord.js');
const util = require('../util');
const roles = require('../../assets/roles.json');
const categories = require('../userCategory');
const langPTBR = require('../../assets/pt_BR');

const TIMEOUT = 60 * 1000;

const hiddenRolesSkill = [
	'728382462597660763',
	'728382522370686977',
	'728382580621312113',
];

const hiddenRolesEng = [
	'728383661308903536',
	'728383550969348157',
	'728382933865594881',
];

const englishDescription = roles.eng_roles
	.map(engRole => `${engRole.react}  -  ${engRole.name}`)
	.join('\n');
const skillsDescriptionLine = roles.skill_roles
	.map(skillRole => `${skillRole.react}  -  ${skillRole.name}`)
	.join('\n');
const skillsDescription = `${skillsDescriptionLine}\n\n✅ - Pronto.\n:exclamation: **Espere até que todas as reações carreguem para receber devidamente suas tags.**`;

const createEmbedResponse = ({ author, collectors, client }) =>
	new Discord.RichEmbed()
		.setTitle(`**Apresentação** » ${author.username}`)
		.setThumbnail(author.avatarURL)
		.setColor('#8146DC')
		.addField('**Sobre:**', collectors.about.collected.first().content)
		.addField('**Nome:**', collectors.name.collected.first().content, true)
		.addField(
			'**Nickname:**',
			collectors.nick.collected.first().content,
			true
		)
		.addField(
			'**Portfólio:**',
			collectors.git.collected.first().content,
			true
		)
		.addField(
			'**Conhecimentos:**',
			client.guilds
				.get(process.env.GUILD_ID)
				.members.get(author.id)
				.roles.filter(role => hiddenRolesSkill.includes(role.id))
				.map(role => `<@&${role.id}>`)
				.join(', ') || '`Nenhum`',
			true
		)
		.addField(
			'**Nível de inglês:**',
			client.guilds
				.get(process.env.GUILD_ID)
				.members.get(author.id)
				.roles.filter(role => hiddenRolesEng.includes(role.id))
				.map(role => `<@&${role.id}>`)
				.join(', ') || '`Nenhum`',
			true
		)
		.setFooter(
			`${util.getYear()} © He4rt Studios`,
			'https://i.imgur.com/rRr6Md6.png'
		)
		.setTimestamp();
const isAuthor = (message, author) => message.author.id === author.id;
const collect = promisify((collector, cb) => {
	collector.on('end', (collected, reason) => {
		const collectedArray = collected.array();
		if (collectedArray.length) {
			cb(null, collectedArray);
		} else {
			cb(new Error(reason));
		}
	});
});
const collectMessage = message => {
	const collector = message.author.dmChannel.createMessageCollector(
		({ author }) => isAuthor(message, author),
		{ time: TIMEOUT }
	);
	collector.on('collect', msg => {
		if (!util.isCommand(msg)) {
			collector.stop();
		}
	});
	return collect(collector).then(() => collector);
};

const sendSkillsMessage = async author => {
	const message = await author.send(
		`${langPTBR.continuar.skills.title}\n\n${skillsDescription}`
	);

	await message.react('1⃣');
	await message.react('2⃣');
	await message.react('3⃣');
	await message.react('4⃣');
	await message.react('✅');
	return message;
};
const collectSkillsReactions = async ({
	author,
	message, // message with skills reactions
	client,
	skillRoles,
}) => {
	const collector = message.createReactionCollector(
		(reaction, user) => isAuthor({ author }, user),
		{ time: TIMEOUT }
	);
	collector.on('collect', async reaction => {
		if (reaction.emoji.name === '✅') {
			collector.stop();
			return;
		}

		const emoji = reaction.emoji.name;
		const selectedRole = skillRoles.find(role => role.emoji === emoji);
		if (!selectedRole) {
			return;
		}
		await client.guilds
			.get(process.env.GUILD_ID)
			.members.get(author.id)
			.addRole(selectedRole.id);
		await author.send('``✅`` Cargo adicionada com sucesso!');
	});
	return collect(collector).then(() => collector);
};

const sendEnglishMessage = async author => {
	const message = await author.send(
		`${langPTBR.continuar.english.title}\n\n${englishDescription}`
	);

	await message.react('🇦');
	await message.react('🇧');
	await message.react('🇨');
	return message;
};
const collectEnglishReactions = async ({
	author,
	message, // message with english reactions
	client,
	engRoles,
}) => {
	const collector = message.createReactionCollector(
		(reaction, user) => isAuthor({ author }, user),
		{ time: TIMEOUT }
	);
	collector.on('collect', async reaction => {
		const emoji = reaction.emoji.name;
		const engRole = engRoles.find(role => role.react === emoji);
		if (!engRole) {
			return;
		}
		await client.guilds
			.get(process.env.GUILD_ID)
			.members.get(author.id)
			.addRole(engRole.id);
		collector.stop();
	});
	return collect(collector).then(() => collector);
};
const cooldown = {};
module.exports = {
	run: async (client, message) => {
		if (cooldown[message.author.id]) {
			throw new Error('cooldown');
		}
		cooldown[message.author.id] = true;
		const skillRoles = roles.skill_roles;
		const engRoles = roles.eng_roles;
		const collectors = {};

		const presentedRole = client.guilds
			.get(process.env.GUILD_ID)
			.roles.find(role => role.name === '🎓 Apresentou');

		if (
			client.guilds
				.get(process.env.GUILD_ID)
				.members.get(message.author.id)
				.roles.some(role => role.name === presentedRole.name)
		) {
			throw new Error('registered');
		}

		await message.author.send(langPTBR.continuar.name.title);
		collectors.name = await collectMessage(message);

		await message.author.send(langPTBR.continuar.nick.title);
		collectors.nick = await collectMessage(message);

		await message.author.send(langPTBR.continuar.about.title);
		collectors.about = await collectMessage(message);

		// TODO: validar git se tiver inferir em algum canto
		await message.author.send(langPTBR.continuar.portfolio.title);
		collectors.git = await collectMessage(message);

		const skillsMessage = await sendSkillsMessage(message.author);
		await collectSkillsReactions({
			client,
			author: message.author,
			message: skillsMessage,
			skillRoles,
		});

		const englishMessage = await sendEnglishMessage(message.author);
		await collectEnglishReactions({
			client,
			author: message.author,
			message: englishMessage,
			engRoles,
		});

		const embedResponse = createEmbedResponse({
			collectors,
			client,
			author: message.author,
		});
		await client.guilds
			.get(process.env.GUILD_ID)
			.members.get(message.author.id)
			.addRole(process.env.APRESENTOU_ROLE);
		await client.channels
			.get(process.env.APRESENTACAO_CHAT)
			.send(embedResponse);
	},
	async fail(err, client, message) {
		if (err.message === 'cooldown') {
			const cooldownEmbed = new Discord.RichEmbed()
				.setTitle(
					'``❌`` **Você já utilizou este comando, verifique sua DM para mais informações.**'
				)
				.setColor('#36393E');
			return message.channel.send(cooldownEmbed);
		}
		cooldown[message.author.id] = false;

		// geralmente quando user ta com dm desativada
		if (err.message === 'Cannot send messages to this user') {
			const dmDisabled = new Discord.RichEmbed()
				.setTitle(
					'``❌`` **Ops, seu privado está desativado e não consigo enviar algumas informações.**'
				)
				.setColor('#36393E');
			return message.channel.send(dmDisabled);
		}
		if (err.message === 'registered') {
			return message.channel
				.send('``❌`` Você já se apresentou.')
				.then(msg => msg.delete(8000));
		}
		if (err.message === 'time') {
			const timeout = new Discord.RichEmbed()
				.setTitle('``❌`` **Tempo limite de resposta excedido.**')
				.setDescription(
					'Utilize `!continuar` para terminar sua apresentação.'
				)
				.setColor('#36393E');
			return message.author.send(timeout);
		}
		return null;
	},
	async success(client, message, args) {
		cooldown[message.author.id] = false;
		const success = new Discord.RichEmbed({
			title: '``✅`` **Apresentação finalizada com sucesso.**',
			color: 0x36393e,
		});
		await message.author.send(success);
	},
	get command() {
		return {
			name: 'continuar',
			category: categories.USER,
			description: 'O usuario irá continuar a apresentação.',
			usage: 'continuar',
		};
	},
};
