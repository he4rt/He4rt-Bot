const Discord = require('discord.js');
const categories = require('../userCategory');

module.exports = {
    async run(client, message, args) {
      
        const value = args.slice(0).join('');

        if(!value){
            message.channel.send("``❗`` Sintaxe incorreta, utilize ``!flip <valor>``.");
            return;
        }

        var betValue = parseInt(value);

        if(betValue === NaN){
            message.channel.send("``❗`` Valor inválido.");
            return;
        }
        if(betValue > 500){
            message.channel.send("``❗`` Valor máximo de aposta: ``500 HCoins``.");
            return;
        }
        
        if(betValue <= 0){
            message.channel.send("``❗`` Valor mínimo de aposta: ``1 HCoin``.");
            return;
        }

        client.axios.get(`/users/${message.author.id}`).then(res => {
            var userMoney = res.data.money;

            if(userMoney < betValue){
                message.channel.send("``❗`` Seu saldo é menor que "+betValue+".");
                return;
            }
    
            const embed = new Discord.RichEmbed()
            .setTitle('``👑`` » !flip')
            .setColor('#8146DC')
            .setDescription("Reaja abaixo com os emojis para apostar. \n\n:bust_in_silhouette: para cara ou :crown: para coroa.")
            .addField('**Valor da aposta:**', betValue)
            .setFooter(
              `Comando utilizado por: ${message.author.tag}`,
              'https://heartdevs.com/wp-content/uploads/2018/12/logo.png'
            )
            .setTimestamp();
    
            message.channel.send(embed).then(async function (msg) {
    
                await msg.react("👤");
                await msg.react("👑");
    
                var result = "";
                var userBet = null;
    
                var generatedNumber = Math.floor(Math.random() * 100) + 1  ;
                result = generatedNumber < 50 ? "cara" : "coroa";
    
                const filter = (reaction, user) => user.id === message.author.id
                const collector = msg.createReactionCollector(filter, { time: 15000 });
                collector.on('collect', r => {

                    collector.stop();
                
                    var member = message.member;

                    userBet = r.emoji.name == "👤" ? "cara" : r.emoji.name == "👑" ? "coroa" : null;
    
                    if(userBet != null){
                        
                        collector.stop();

                        var winValue = betValue * 1.5;
    
                        client.axios.post(`/users/${member.id}/money/reduce`, {value: betValue}).then(res => {
                        }).catch(err => {console.log(err)});
    
                        var win = false;
                        win = result == userBet;
    
                        if(win){

                            const newEmbed = new Discord.RichEmbed({
                                title: '``👑`` » !flip',
                                description: "``🏆`` Parabéns "+message.author.toString()+", você ganhou "+winValue+" HCoins!",
                              });
                              r.message.edit(newEmbed);                              
                            client.axios.post(`/users/${member.id}/money/add`, {value: winValue}).then(res => {
                            }).catch(err => {console.log(err)});

                        } else {

                            const newEmbed = new Discord.RichEmbed({
                                title: '``👑`` » !flip',
                                description: "``❌`` Desculpe "+message.author.toString()+", mas você perdeu "+betValue+" HCoins!",
                              });
                              r.message.edit(newEmbed);

                        }
    
                    }
    
                });
    
            });
        })

        


    },
  
    get command() {
      return {
        name: 'flip',
        category: categories.USER,
        description: 'Cara ou coroa.',
        usage: 'comando',
      };
    },
  };
  
