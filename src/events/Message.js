const EventBase = require('./EventBase');
const { commands, client, axios } = require('..');
const { log, logTypes } = require('../util/log');

class Message extends EventBase {
	constructor() {
		super('message');
	}

	execute = async message => {
		const { COMMAND_PREFIX } = process.env;
		const { content, member } = message;

		if (!content.startsWith(COMMAND_PREFIX)) {
			return;
		}

		const [commandName, ...params] = content
			.slice(1, content.length)
			.split(' ');

		const command = commands.find(
			x => x.name === commandName.toLowerCase(),
		);

		if (!command) {
			return;
		}

		await message.delete();

		if (!command.execute) {
			log(
				`Execute not found for command: ${command.name}`,
				logTypes.ERROR,
			);
			return;
		}

		const { execute, checkRoles, name } = command;

		if (!checkRoles(member)) {
			await message.reply(
				`Você não tem permissão para executar o comando '${name}'`,
			);
			log(
				`User doesnt have required roles to execute ${name}`,
				logTypes.WARN,
			);
			return;
		}

		await execute(message, client, params, axios);
	};
}

module.exports = Message;
