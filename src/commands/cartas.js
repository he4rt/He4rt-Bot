const Discord = require('discord.js')

module.exports = {
    async run(client, message, args) {
        
        let correct = Math.floor(Math.random() * 9) + 1
        let value = Number(args[0])
        let number = Number(args[1])
        let cards = ['🎴','🎴','🎴',
                    '🎴','🎴','🎴',
                    '🎴','🎴','🎴']
        let showCards = cards.map((el, i) => ((i + 1) % 3) === 0 ? `${el}\n\n` : `${el} ` ).join("");
        let userMoney = 0

        if (!value || !number || number < 1 || number > 9 || value < 1) {
            client.axios.get(`/users/${message.author.id}`).then(res => {
                return message.channel.send("``💸`` Seu saldo: "+res.data.money+" HCoins.")
            })
            return message.channel.send("``🀄`` Como utilizar o comando: ``!cartas <valor> <1-9>``.")
        }
        
        client.axios.get(`/users/${message.author.id}`).then(res => {
            userMoney = res.data.money
            
            if (userMoney < value) {
                return message.channel.send("``❗`` Seu saldo é menor que "+value+".")
            }

            if (number === correct) {
                let winner = value * 1.5

                client.axios.post(`/users/${message.author.id}/money/add`, {value: winner}).then(res => {
                }).catch(err => {console.log(err)});

                cards[correct-1] = '🃏'
                showCards = cards.map((el, i) => ((i + 1) % 3) === 0 ? `${el}\n\n` : `${el} ` ).join("");
                message.channel.send(showCards)
                return message.channel.send("``💰`` Parabéns <@"+message.author.id+"> você ganhou "+winner+" HCoins")
            } else {
                client.axios.post(`/users/${message.author.id}/money/reduce`, {value: value}).then(res => {
                }).catch(err => {console.log(err)});

                cards[correct-1] = '🃏'
                showCards = cards.map((el, i) => ((i + 1) % 3) === 0 ? `${el}\n\n` : `${el} ` ).join("");
                message.channel.send(showCards)
                return message.channel.send("``❌`` Tente na próxima <@"+message.author.id+"> você perdeu "+value+" HCoins")
            }
        })
    },
  
    get command() {
      return {
        name: 'cartas',
        category: 'All',
        description: 'Descrição do Comando',
        usage: 'cartas <valor> <1-9>',
      };
    },
  };
  