/* eslint-disable no-await-in-loop */
const moment = require('moment');

let cycle = 'COFFE';
let currentTimer = 'Iniciando...';

// Muda o nome da aba do coworking
const changeCoworkingCategoryName = async (client, name) => {
	const category = client.guilds
		.get(process.env.GUILD_ID)
		.channels.find(c => c.id === process.env.COWORKING_CATEGORY_ID);
	return category.setName(name);
};

// Inicia um countdown e fica atualizando o timer
const countdown = (minutes, seconds) => {
	return new Promise(resolve => {
		let endTime;
		let hours;
		let mins;
		let msLeft;
		let time;

		function twoDigits(n) {
			return n <= 9 ? `0${n}` : n;
		}

		function updateTimer() {
			msLeft = endTime - +new Date();
			if (msLeft < 1000) {
				console.log('Time end');
				resolve();
			} else {
				time = new Date(msLeft);
				hours = time.getUTCHours();
				mins = time.getUTCMinutes();
				// eslint-disable-next-line prettier/prettier
				currentTimer = `${hours ? `${hours}:${twoDigits(mins)}` : mins}:${twoDigits(time.getUTCSeconds())}`;
				setTimeout(updateTimer, time.getUTCMilliseconds() + 500);
			}
		}

		endTime = +new Date() + 1000 * (60 * minutes + seconds) + 500;
		updateTimer();
	});
};

// Fica atualizando o nome da aba com o timer
const startAutoUpdateCategory = client => {
	const interval = 2000;
	return setInterval(async () => {
		await changeCoworkingCategoryName(client, `${cycle} - ${currentTimer}`);
	}, interval);
};

// Roda as 13:00
module.exports.start = async client => {
	console.log('Iniciando ciclo do coworking!', moment().hour());
	const intervalId = startAutoUpdateCategory(client);
	// Fica no ciclo até as 8 horas
	while (moment().hour() <= 20) {
		cycle = 'COFFE';
		await countdown(10, 0);
		cycle = 'FOCUSED';
		await countdown(50, 0);
	}

	// Fim do loop
	clearInterval(intervalId);
	changeCoworkingCategoryName(client, 'ENCERRADO');
	console.log('Ciclo do coworking encerrado');
};
