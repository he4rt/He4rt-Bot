const Discord = require('discord.js');
module.exports = {
    async run(client, message) {

            var member = message.member;
            client.axios.post(`/users/${member.id}/daily`).then(res => {

                const embed = new Discord.RichEmbed()
            .setTitle('``👑`` » !daily')
            .setColor('#8146DC')
            .setDescription("``🏆`` Você ganhou ``"+res.data.daily+"`` HCoins de bônus diário! Para ver seu saldo, digite ``!coins``")
            .setFooter(
              `Comando utilizado por: ${message.author.tag}`,
              'https://heartdevs.com/wp-content/uploads/2018/12/logo.png'
            )
            .setTimestamp();
    
            message.channel.send(embed);
            }).catch((err) => {

                const embed = new Discord.RichEmbed()
                .setTitle('``👑`` » !daily')
                .setColor('#8146DC')
                .setDescription("``❌`` Você já recebeu seu bônus diário! Tente novamente em: ``"+err.response.data.time.replace("s", " segundo(s)").replace("m", " minuto(s), ").replace("h", " hora(s), ")+"``!")
                .setFooter(
                  `Comando utilizado por: ${message.author.tag}`,
                  'https://heartdevs.com/wp-content/uploads/2018/12/logo.png'
                )
                .setTimestamp();
        
                message.channel.send(embed);
    });    
        
        
    },
  
    get command() {
      return {
        name: 'daily',
        category: 'Users',
        description: 'Coins diários.',
        usage: 'comando',
      };
    },
  };
  