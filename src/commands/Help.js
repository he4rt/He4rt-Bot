const CommandBase = require('./CommandBase');
const { commands } = require('..');

class Help extends CommandBase {
	constructor() {
		super('help', [], 'Exibe a lista de comandos');
	}

	execute = async (message, _, params) => {
		const { COMMAND_PREFIX } = process.env;

		if (params[0] != null) {
			const param = params[0].replace(/!/g, '').toLowerCase();

			const command = commands.find(x => x.name === param);

			if (!command) {
				await message.reply(`Comando ${params[0]} não encontrado`);
				return;
			}

			const { name, description } = command.help();

			await message.channel.send(
				`**${COMMAND_PREFIX}${name}**: ${description}`,
			);
			return;
		}

		const helpStrings = commands.map(cmd => {
			const { name, description } = cmd.help();
			return `**${COMMAND_PREFIX}${name}**: ${description}\n`;
		});

		const helpReduced = helpStrings.reduce(
			(prev, curr) => {
				const { str, msgs } = prev;
				return str.length + curr.length < 2000
					? { str: str + curr, msgs }
					: { str: curr, msgs: [...msgs, str] };
			},
			{ str: '', msgs: [] },
		);

		const messagesToSend = [...helpReduced.msgs, helpReduced.str];

		await messagesToSend.reduce(async (prev, curr) => {
			await prev;
			return message.channel.send(curr);
		}, Promise.resolve());
	};
}

module.exports = Help;
