const { SlotMachine, SlotSymbol } = require('slot-machine');

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
    console.log(`Error when removing ${value} to ${discordId}`, e.toString());
  }
}

function setup() {
  const watermelon = new SlotSymbol('watermelon', {
    display: '🍉',
    points: 0.33,
    weight: 20,
  });

  const orange = new SlotSymbol('orange', {
    display: '🍊',
    points: 0.4,
    weight: 20,
  });

  const grape = new SlotSymbol('grape', {
    display: '🍇',
    points: 0.5,
    weight: 17,
  });

  const banana = new SlotSymbol('banana', {
    display: '🍌',
    points: 0.7,
    weight: 14,
  });

  const cherry = new SlotSymbol('cherry', {
    display: '🍒',
    points: 1,
    weight: 11,
  });

  const bell = new SlotSymbol('bell', {
    display: '🔔',
    points: 5,
    weight: 8,
  });

  const leaf = new SlotSymbol('leaf', {
    display: '🍀',
    points: 10,
    weight: 5,
  });

  const diamond = new SlotSymbol('diamond', {
    display: '💎',
    points: 50,
    weight: 2,
  });

  const seven = new SlotSymbol('seven', {
    display: ':seven:',
    points: 100,
    weight: 1,
  });

  const wild = new SlotSymbol('wildcard', {
    display: '❔',
    points: 1,
    weight: 2,
    wildcard: true,
  });


  return new SlotMachine(3, [
    watermelon,
    orange,
    grape,
    banana,
    cherry,
    bell,
    leaf,
    diamond,
    seven,
    wild,
  ]);
}

// Chamar a função caso queira conferir as chances
function logChances() {
  const machine = setup();

  console.log(`Chance of watermelon ${machine.chanceOf('watermelon')}`);
  console.log(`Chance of orange ${machine.chanceOf('orange')}`);
  console.log(`Chance of grape ${machine.chanceOf('grape')}`);
  console.log(`Chance of banana ${machine.chanceOf('banana')}`);
  console.log(`Chance of cherry ${machine.chanceOf('cherry')}`);
  console.log(`Chance of bell ${machine.chanceOf('bell')}`);
  console.log(`Chance of leaf ${machine.chanceOf('leaf')}`);
  console.log(`Chance of diamond ${machine.chanceOf('diamond')}`);
  console.log(`Chance of seven ${machine.chanceOf('seven')}`);
}

const isWin = lines => lines.some(x => x.isWon);

function play(message, betValue, client) {
  const machine = setup();
  const game = machine.play();

  const gameResult = game.visualize().replace(/ /g, ' : ');
  let answer = `\n**[  :slot_machine: l SLOTS ]**\n------------------\n${gameResult}\n------------------\n`;

  if (isWin(game.lines)) {
    const multiplier = game.totalPoints > 1 ? game.totalPoints.toFixed(2) : 1;

    answer += `**Você ganhou x${multiplier} do valor, ${betValue *
      multiplier}** <:hcoin:569673513854828544>`;

    addValue(client, message.author.id, betValue * multiplier - betValue);
  } else {
    answer += `**Você perdeu ${betValue}** <:hcoin:569673513854828544> **:(**`;
    removeValue(client, message.author.id, betValue);
  }

  message.reply(answer);
}

module.exports = {
  async run(client, message, args) {
    const betValue = parseInt(args[0], 10);

    if (isNaN(betValue) || betValue < 1)
      return message.reply('Você deve apostar um valor maior que 0');

    if (betValue > 500) return message.reply('O valor máximo de aposta é 500');

    const balance = await getBalance(client, message.author.id);

    if (isNaN(balance))
      return message.reply(
        `Não foi possível encontrar seu balanço no banco de dados`
      );

    if (betValue > balance)
      return message.reply(
        `Você não tem créditos suficientes para essa aposta, seu balanço é de ${balance}`
      );

    play(message, betValue, client);
  },

  get command() {
    return {
      name: 'niquel',
      category: 'Usuários',
      description: 'Máquina de caça-niquels',
      usage: 'niquel',
    };
  },
};
