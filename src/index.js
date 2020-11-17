const Discord = require('discord.js');
const fs = require('fs-extra');
const Enmap = require('enmap');
const axios = require('axios');

const client = new Discord.Client({ forceFetchUsers: true });
require('dotenv').config();

client.axios = axios.create({
	baseURL: process.env.HE4RT_API,
	timeout: 5000,
	headers: { Authorization: process.env.HE4RT_TOKEN },
});

client.commands = new Enmap();

const init = async () => {
	const { data } = await client.axios.post(`bot/gamification/levelup`, {
		discord_id: '426540070028443688',
		message: 'a',
		donator: false,
	});
	console.log(data);
	const cmdFiles = await fs.readdir('src/commands/');
	console.log(
		'[#LOG]',
		`Carregando o total de ${cmdFiles.length - 1} comandos.`
	);
	cmdFiles.shift();
	cmdFiles.forEach(f => {
		try {
			// eslint-disable-next-line
			const props = require(`./commands/${f}`);
			if (f.split('.').slice(-1)[0] !== 'js') return;
			if (props.init) {
				props.init(client);
			}
			client.commands.set(props.command.name, props);
		} catch (e) {
			console.log(`[#ERROR] Impossivel executar comando ${f}: ${e}`);
		}
	});

	const evtFiles = await fs.readdir('src/events/');
	console.log('[#LOG]', `Carregando o total de ${evtFiles.length} eventos.`);
	evtFiles.forEach(f => {
		const eventName = f.split('.')[0];
		// eslint-disable-next-line
		const event = require(`./events/${f}`);

		client.on(eventName, event.bind(null, client));
	});

	client.on('error', err => console.error('[#ERROR]', err));

	client.login(process.env.AUTH_TOKEN);
};
init();

module.exports = client.commands;
