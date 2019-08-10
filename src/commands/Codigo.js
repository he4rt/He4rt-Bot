const CommandBase = require('./CommandBase');

class Codigo extends CommandBase {
	constructor() {
		super('codigo', [], 'Mostra como formatar um bloco de código.');
	}

	execute = async message => {
		const answer =
			"Formate seu código:\n\\`\\`\\`js\n    CODIGO AQUI\n\\`\\`\\`\nTroque 'js' por sua lang";

		await message.channel.send(answer);
	};
}

module.exports = Codigo;
