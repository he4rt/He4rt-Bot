const CommandBase = require('./CommandBase');

class Coins extends CommandBase {
	constructor() {
		super('coins', [], 'Mostra como formatar um bloco de código.');
	}

	execute = async message => {};
}

module.exports = Coins;
