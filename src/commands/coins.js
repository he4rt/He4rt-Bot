const Discord = require('discord.js')

module.exports = {
    async run(client, message, args) {
        const member = message.mentions.members.first(); 
        const quantity = args[2]
        if(!args[0] || !args[1] || isNaN(quantity) || quantity < 1) { 
            client.axios.get(`/users/${message.author.id}`).then(res => {
                return message.channel.send("``💸`` Seu saldo: "+res.data.money+" HCoins.")
            })
            return message.channel.send("``🎲`` Como utilizar o comando: ``!coins <@usuário> <add/remove> <valor>``.")
        }
        if (member) {
            if (args[1] === 'add' && quantity) {
                client.axios.post(`/users/${member.id}/money/add`, {value: quantity}).then(res => {
                    return message.channel.send("``✅`` Foram adicionados "+quantity+" HCoins na conta do usuário <@"+member.id+">")
                }).catch(err => {console.log(err)})
            } else if (args[1] === 'remove' && quantity) {
                client.axios.post(`/users/${member.id}/money/reduce`, {value: quantity}).then(res => {
                    return message.channel.send("``❌`` Foram removidos "+quantity+" HCoins da conta do usuário <@"+member.id+">")
                }).catch(err => {console.log(err)})
            }
        } else {
            return message.channel.send("``❌`` Usuário não existente.")
        }
    },
  
    get command() {
        return {
        name: 'coins',
        category: 'Admin/Mod',
        description: 'Dar ou Remover uma certa quantia de coins de um determinado user',
        usage: 'coins <add/remove> <@user> <quantia>',
        };
    },
};