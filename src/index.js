const jimp = require('jimp');
const { Client } = require('discord.js');
const { create } = require('axios');
const { config } = require('dotenv');
const { readdir } = require('fs-extra');
const { log, logTypes } = require('./util/log');
const { jimpLoader } = require('./util/jimpLoader');

const client = new Client({ forceFetchUsers: true });
const cfg = config();
const commands = [];

const axios = create({
	baseURL: process.env.HE4RT_API,
	timeout: 5000,
	headers: { 'Api-Key': process.env.HE4RT_TOKEN },
});

const initialize = async () => {
	const jmp = await jimpLoader();
	module.exports.jimpLoads = jmp;

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
			log(`Command '${Command.name}' doesnt implements the execute function`, logTypes.ERROR);
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
			log(`Event '${name}' doesnt implements the execute function`, logTypes.ERROR);
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
