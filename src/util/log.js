const { bold } = require('chalk');

const logTypes = {
	WARN: {
		color: bold.yellowBright,
		content: 'WARN ',
	},
	ERROR: {
		color: bold.redBright,
		content: 'ERROR',
	},
	DEBUG: {
		color: bold.greenBright,
		content: 'DEBUG',
	},
};

const log = (message, { color, content } = logTypes.DEBUG) => {
	const tag = color(`[${content}]:`);
	const clock = color(new Date().toLocaleTimeString());
	const msg = color(`| ${message.toString() || message}`);

	console.log(`${tag} ${clock} ${msg}`);
};

module.exports = {
	log,
	logTypes,
};
