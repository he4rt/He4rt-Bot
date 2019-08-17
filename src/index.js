const jimp = require('jimp');
const { Client } = require('discord.js');
const { create } = require('axios');
const { config } = require('dotenv');
const { readdir } = require('fs-extra');
const { log, logTypes } = require('./util/log');

const client = new Client({ forceFetchUsers: true });
const cfg = config();
const commands = [];

const axios = create({
	baseURL: process.env.HE4RT_API,
	timeout: 5000,
	headers: { 'Api-Key': process.env.HE4RT_TOKEN },
});
const maskPath = require.resolve('./assets/maskHex.png');
const fontDefaultPath = require.resolve('./assets/font/Pixellari-22px.fnt');
const fontYellowPath = require.resolve('./assets/font/Pixellari-yellow-22px.fnt');
const initialize = async () => {
	const { data } = await axios.get('/users', {
		discord_id: '426540070028443688'
	});

	const fontDefault = await jimp.loadFont(fontDefaultPath);
	const fontYellow = await jimp.loadFont(fontYellowPath);
	const background = await jimp.read('https://i.imgur.com/EHBGtnb.png');
	const mask = await jimp.read(maskPath);
	const avatar = await jimp.read('https://images-ext-1.discordapp.net/external/-FgFlMr0HzbgG5dJ4XhI64VEfTrhqz9e9RDTH4Tzbn0/%3Fsize%3D2048/https/cdn.discordapp.com/avatars/255114170008076292/a53ab20f9435ca1d5358a0d471804805.png?width=633&height=633');

	mask.resize(129, 131);
	avatar.resize(129, 131);
	avatar.mask(mask);
	background.composite(avatar, 13, 20);

	background.print(
		fontDefault,
		209,
		26,
		{
			text: `Kinash`
		},
		1,
	);

	background.print(
		fontDefault,
		214,
		60,
		{
			text: `25`
		},
		1,
	);
	
	background.print(
		fontYellow,
		230,
		93,
		{
			text: `$4517.00`
		},
		1,
	);

	const aboutText = 'Me chamo à Víctor, conheci a programação através do SA:MP com a linguagem PAWN e desde sempre quis me aprofundar nisso mas só agora realmente fui. No momento estudando JavaScript porem um mero iniciante'

	background.print(
		fontDefault,
		349,
		70,
		{
			text: aboutText.length > 220 ? `${aboutText.substring(0, 220)}...` : aboutText
		},
		300
	);

	background.write('profile.png');

	console.log(data);

	const cmds = await readdir('src/commands/');
	const evts = await readdir('src/events/');

	log(`Found ${cmds.length - 1} command files`);
	log(`Found ${evts.length - 1} event files`);

	cmds.forEach(commandFile => {
		const CommandClass = require(`./commands/${commandFile}`);
		const Command = new CommandClass();

		if (!Command.name) {
			return;
		}

		if (!Command.execute) {
			log(
				`Command '${Command.name}' doesnt implements the execute function`,
				logTypes.ERROR,
			);
			return;
		}

		Command.execute.bind(Command);

		commands.push(Command);
		log(`Loaded command: ${Command.name}`);
	});

	evts.forEach(eventFile => {
		const EventClass = require(`./events/${eventFile}`);
		const { name, execute } = new EventClass();

		if (!name) {
			return;
		}

		if (!execute) {
			log(
				`Event '${name}' doesnt implements the execute function`,
				logTypes.ERROR,
			);
			return;
		}

		client.on(name, execute);
		log(`Loaded event: ${name}`);
	});

	await client.login(process.env.AUTH_TOKEN);
};

initialize();

module.exports = {
	commands,
	client,
	axios,
	cfg,
};
