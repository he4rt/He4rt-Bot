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

		const [command, ...params] = content
			.slice(1, content.length)
			.split(' ');

		const { execute, checkRoles, name } = commands.find(
			x => x.name === command.toLowerCase(),
		);

		await message.delete();

		if (!execute) {
			log(`Execute not found for command: ${name}`, logTypes.ERROR);
			return;
		}

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
