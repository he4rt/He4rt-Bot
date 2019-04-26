const Discord = require('discord.js')

module.exports = {
    async run(client, message, args) {
        
        let correct = Math.floor(Math.random() * 9) + 1
        let value = Number(args[0])
        let number = Number(args[1])
        let cards = ['🎴','🎴','🎴',
                    '🎴','🎴','🎴',
                    '🎴','🎴','🎴']
        let showCards = cards.map((el, i) => ((i + 1) % 3) === 0 ? `${el}` : `${el} ` ).join("");
        let userMoney = 0

        if (!value || !number || number < 1 || number > 9 || value < 1) {
            client.axios.get(`/users/${message.author.id}`).then(res => {
                return message.channel.send("``💸`` Seu saldo: "+res.data.money+" <:hcoin:548969665020297216>.")
            })
            return message.channel.send("``🀄`` Como utilizar o comando: ``!cartas <valor> <1-9>``.")
        }
        
        client.axios.get(`/users/${message.author.id}`).then(res => {
            userMoney = res.data.money
            
            if (userMoney < value) {
                return message.channel.send("``❗`` Seu saldo é menor que "+value+".")
            }

            if (value > 500) {
                return message.channel.send("``❗`` O valor máximo de aposta é ``500``.")
            }

            if (number === correct) {
                let winner = value * 1.5

                client.axios.post(`/users/${message.author.id}/money/add`, {value: winner}).then(res => {
                }).catch(err => {console.log(err)});

                cards[correct-1] = '🃏'
                showCards = cards.map((el, i) => ((i + 1) % 3) === 0 ? ` ${el}\n` : ` ${el} :` ).join("");
                message.channel.send(`\n**[  :slot_machine: | CARDS ]**\n------------------\n${showCards}------------------\n`)
                return message.channel.send('``💰`` ' + `**${message.author.username}, você ganhou ${winner}** <:hcoin:548969665020297216>.`)
            } else {
                client.axios.post(`/users/${message.author.id}/money/reduce`, {value: value}).then(res => {
                }).catch(err => {console.log(err)});

                cards[correct-1] = '🃏'
                showCards = cards.map((el, i) => ((i + 1) % 3) === 0 ? ` ${el}\n` : ` ${el} :` ).join("");
                message.channel.send(`\n**[  :slot_machine: | CARDS ]**\n------------------\n${showCards}------------------\n`)
                return message.channel.send('``💰`` ' + `**${message.author.username}, você perdeu ${value}** <:hcoin:548969665020297216>.`)
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
  