const Discord = require('discord.js');
const fs = require('fs-extra');
const Enmap = require('enmap');
const { scheduleJob } = require('node-schedule');

const client = new Discord.Client({ forceFetchUsers: true });
require('dotenv').config();

client.commands = new Enmap();

const init = async () => {
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
	const guild = client.guilds.get(process.env.GUILD_ID);

	scheduleJob('0 0 11 */15 * *', () => {
		guild.members
			.filter(m => m.roles.find('id', '735623088414261268'))
			.map(m =>
				m.sendMessage(
					'Não esqueça de marcar seu 1 on 1 através do link https://calendly.com/he4rtmarketing/1on1 !'
				)
			);
	});
};
init();

module.exports = client.commands;
