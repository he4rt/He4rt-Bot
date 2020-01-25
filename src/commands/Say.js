const CommandBase = require('./CommandBase');

class Say extends CommandBase {
	constructor() {
		super('say', [process.env.ADMIN_ROLE], 'Manda uma mensagem pelo bot');
	}

	execute = async (msg, _, params) => {
		const sayMessage = params.join(' ').trim() || '';

		if (!sayMessage || sayMessage.length < 1) {
			const errMsg = await msg.reply(
				':x: Voce deve informar uma mensagem',
			);
			errMsg.delete(5000);
			return;
		}

		await msg.channel.send(sayMessage);
	};
}

module.exports = Say;
