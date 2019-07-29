const Discord = require('discord.js');
const categories = require("../userCategory");

module.exports = {
  run: async (client, message, args) => {

    let page = 1;

    if(args.length){
      page = parseInt(args[0])
      if(!Number.isInteger(page)){
        return message.channel.send("Escolha um número pra paginação");
      }
    }
    let count = args[0] ? args[0] : 1
    count = count * 10
    //console.log(count)
    client.axios.get('/ranking?page='+ page)
    .then(res => {
      //console.log(res.data)
      const ranking = res.data
      const value = []
      for(let i in ranking.data){
        let rank = ranking.data[i]
        let user =  client.guilds
        .get(process.env.GUILD_ID)
        .members.get(ranking.data[i].discord_id)
        if(user){
          value.push( (1 + parseInt(i) + (count - 10)  ) + " | "+ user.user.username + " | Level: " + rank.level  + " | Exp: " + rank.current_exp)
        }else{
          value.push( (1 + parseInt(i) + (count - 10)  ) + " | Usuário Banido | Level: " + rank.level  + " | Exp: " + rank.current_exp)
        }
      }
      
      
      const embed = new Discord.RichEmbed()
      .setTitle('``🏆`` » !ranking')
      .addField("Pagina #"+ page + " de " + ranking.last_page, value, true)
      .setTimestamp()
    
      message.channel.send("<@" + message.author.id + ">", {embed}).then(msg => {
        msg.react('⬅').then(r => {
          msg.react('➡')
          
          const next = (reaction, user) => reaction.emoji.name === '➡' && user.id === message.author.id;
          const back = (reaction, user) => reaction.emoji.name === '⬅' && user.id === message.author.id;
          
          const nextVerify = msg.createReactionCollector(next, {time: 120000})
          const backVerify = msg.createReactionCollector(back, {time: 120000})
          
          let t = res.data.current_page

          nextVerify.on('collect', r => {

            let count = res.data.current_page ? args[0] : 0
    
            client.axios.get('/ranking?page='+ (t + 1))
            .then(res => {
              //console.log(res.data)
              const ranking = res.data
              const value = []
              for(let i in ranking.data){
                let rank = ranking.data[i]
                let user =  client.guilds
                .get(process.env.GUILD_ID)
                .members.get(ranking.data[i].discord_id)
                if(user){
                  value.push( (1 + parseInt(i) + (t * 10)  ) + " | "+ user.user.username + " | Level: " + rank.level  + " | Exp: " + rank.current_exp)
                }else{
                  value.push( (1 + parseInt(i) + (t * 10)  ) + " | Desconhecido | Level: 0 | Exp: 0")
                }
              }

              const embed2 = new Discord.RichEmbed()
              .setTitle('``🏆`` » !ranking')
              .addField("Pagina #"+ res.data.current_page + " de " + ranking.last_page, value, true)
              .setTimestamp()
              console.log(value)
              t++;
              msg.edit("<@" + message.author.id + ">", embed2);
              //message.channel.send(value2)
            
            })
              
            })
            t = res.data.current_page
            
            backVerify.on('collect', r=> {
            client.axios.get('/ranking?page='+ (t - 1))
            .then(res => {
              let count2 = res.data.current_page * 10;
              //console.log(res.data)
              const ranking = res.data
              const value = []
              for(let i in ranking.data){
                let rank = ranking.data[i]
                let user =  client.guilds
                .get(process.env.GUILD_ID)
                .members.get(ranking.data[i].discord_id)
                if(user){
                  value.push( (1 + parseInt(i) + (count2 - 10)  ) + " | "+ user.user.username + " | Level: " + rank.level  + " | Exp: " + rank.current_exp)
                }else{
                  value.push( (1 + parseInt(i) + (count2 - 10)  ) + " | Desconhecido | Level: " + rank.level  + " | Exp: " + rank.current_exp)
                }
                
              }
              const embed2 = new Discord.RichEmbed()
              .setTitle('``🏆`` » !ranking')
              .addField("Pagina #"+ res.data.current_page + " de " + ranking.last_page, value, true)
              .setTimestamp()
              
              msg.edit("<@" + message.author.id + ">", embed2);
              //message.channel.send(value2)
              t--;
            
            })
              
            })
          })
        })
      }).catch(error => console.error);
      
    },
    
    get command() { 
      return {
        name: 'react',
        category: categories.USER,
        description: 'Lista o mapeamento dos usuários mais ativos',
        usage: 'react',
      };
    },
  };
  