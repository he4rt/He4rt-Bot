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
	headers: { Authorization: `Basic ${process.env.HE4RT_TOKEN}` },
});

const initialize = async () => {
	const cmds = await readdir('src/commands/');
	const evts = await readdir('src/events/');

	log(`Found ${cmds.length - 1} command files`);
	log(`Found ${evts.length - 1} event files`);

	cmds.forEach(commandFile => {
		const commandClass = require(`./commands/${commandFile}`);
		const Command = new commandClass();

		if (!Command.name) {
			return;
		}

		if (!Command.execute.bind(Command)) {
			return log(
				`Command '${Command.name}' doesnt implements the execute function`,
				logTypes.WARN,
			);
		}

		commands.push(Command);
		log(`Loaded command: ${Command.name}`);
	});

	evts.forEach(eventFile => {
		const eventClass = require(`./events/${eventFile}`);
		const { name, execute } = new eventClass();

		if (!name) {
			return;
		}

		if (!execute) {
			return log(
				`Event '${name}' doesnt implements the execute function`,
				logTypes.WARN,
			);
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
