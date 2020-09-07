const { scheduleJob } = require('node-schedule');
const coworking = require('./coworking');

module.exports = client => {
	console.log('[#LOG]', 'Inicializando JOBS');
	// coworking.start(client);

	// Inicia o coworking (13:00)
	scheduleJob('0 13 * * *', () => {
		coworking.start(client);
	});
};
