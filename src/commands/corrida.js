const categories = require('../userCategory'), 
ProgressBar = require('../util/progress');

function random(lower = Number.MIN_SAFE_INTEGER, upper = Number.MAX_SAFE_INTEGER) {
    lower = Math.ceil(lower);
    upper = Math.floor(upper);
  
    return Math.floor(Math.random() * (upper - lower + 1)) + lower;
};

async function getBalance(client, discordId) {
	try {
		const { data } = await client.axios.get(`/users/${discordId}`);
		return parseInt(data.money, 10);
	} catch (e) {
		console.log(`Error on getBalance of ${discordId}`, e.toString());
		return false;
	}
}

async function addValue(client, discordId, value) {
	try {
		await client.axios.post(`/users/${discordId}/money/add`, { value });
	} catch (e) {
		console.log(`Error when adding ${value} to ${discordId}`, e.toString());
	}
}

async function removeValue(client, discordId, value) {
	try {
		await client.axios.post(`/users/${discordId}/money/reduce`, { value });
	} catch (e) {
		console.log(
			`Error when removing ${value} to ${discordId}`,
			e.toString()
		);
	}
}

module.exports = {
    async run(client, message, args) {
    message.delete();
    const betValue = parseInt(args[0], 10);

    if (isNaN(betValue) || betValue < 1)
        return message.channel.send(
           '\\❗ Você deve colocar um valor maior que ``0``.'
        );

    if (betValue > 500)
        return message.channel.send(
           '``❗`` O valor máximo de aposta é ``500``.'
        );

    const nBalance = await getBalance(client, message.author.id);
	const balance = parseInt(nBalance, 10);

	if (isNaN(balance))
		return message.channel.send(
			`\\❗ Não foi possível encontrar seu balanço no banco de dados.`
		);

	if (betValue > balance) {
		return message.channel.send(
			`\\❗ Você não tem créditos suficientes para essa aposta, seu balanço é de ${balance}.`
		);
	}

        let racers = [ [], [] ];
        const steps = 20;
        for (let i = 0; i < racers.length; i++) {
            racers[i].length = steps;
            for (let j = 0; j < steps; j++) {
              racers[i][j] = '-\u2003';
          }
        }

        const bot = new ProgressBar(':bar', {
            incomplete: '-\u2003',
            complete: '-\u2003',
            head: '🚘',
            total: 20
          });
          const user = new ProgressBar(':bar', {
            incomplete: '-\u2003',
            complete: '-\u2003',
            head: '🚖',
            total: 20
          });
          let raceStatusMessage = await message.channel.send({
            embed: {
                color: 5678,
                title: '``🚘`` Corrida',
                fields: [
                  {
                    name: `🚙 ${client.user.tag}`,
                    value: `:vertical_traffic_light: ${racers[0].join('')}:checkered_flag:`
                  },
                  {
                    name: `🚗 ${message.author.tag}`,
                    value: `:vertical_traffic_light: ${racers[1].join('')}:checkered_flag:`
                  }
                ]
              }
            })

        let timer = setInterval(() => {
            for (let i = 0; i < random(1, 5); i++) {
                user.tick();
              }
              for (let i = 0; i < random(1, 5); i++) {
                bot.tick();
              }
          
              if (bot.lastDraw) {
                let result = '``🚘`` Corrida',
                  progressBot = `:vertical_traffic_light: ${bot.lastDraw}:checkered_flag:`,
                  progressUser = `:vertical_traffic_light: ${bot.lastDraw}:checkered_flag:`;
          
                if (bot.complete && !user.complete) {
                  result += '- Ganhador ' + client.user.username;
                  progressBot = `:vertical_traffic_light: ${bot.lastDraw}:checkered_flag: :trophy:`;
                  removeValue(client, message.author.id, betValue)
                }
                else if (!bot.complete && user.complete) {
                  result += '- Ganhador ' + message.author.username;
                  progressUser = `:vertical_traffic_light: ${user.lastDraw}:checkered_flag: :trophy:`;
                  addValue(client, message.author.id, betValue * random(1, 2) - betValue)
                }
                else if (bot.complete && user.complete) {
                  result += '- Empate';
                }
          
                raceStatusMessage.edit({
                  embed: {
                    color: 5678,
                    title: result,
                    fields: [
                      {
                        name: `🚙 ${client.user.tag}`,
                        value: progressBot
                      },
                      {
                        name: `🚗 ${message.author.tag}`,
                        value: progressUser
                      }
                    ]
                  }
                }).catch(() => {});
              }
              if (bot.complete || user.complete) {
                clearInterval(timer);
              }
            }, 1000);
    },

    get command() {
        return {
			name: 'corrida',
			category: categories.USER,
			description: 'Aposte uma corrida com o bot.',
			usage: 'corrida',
		};
    }
}