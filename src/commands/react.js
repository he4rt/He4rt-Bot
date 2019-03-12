const Discord = require('discord.js');

module.exports = {
  run: async (client, message, args) => {
    
    if(args[0] < 1 || args[0].includes(",") || args[0].includes("-") || args[0].includes("*") || isNaN(args[0])) return message.channel.send("Tem q ser maior que 0");
    
    const page = args[0] ? args[0] : 1
    let count = args[0] ? args[0] : 0
    let pag = page;
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
        .get("452926217558163456")
        .members.get(ranking.data[i].discord_id).user
        value.push( (1 + parseInt(i) + (count - 10)  ) + " | "+ user.username + " | Level: " + rank.level  + " | Exp: " + rank.current_exp)
      }
      
      
      const embed = new Discord.RichEmbed()
      .setTitle('``🏆`` » !ranking')
      .addField("Pagina #"+ page + " de " + ranking.last_page, value, true)
      .setTimestamp()
     console.log(value)
    
      message.channel.send("<@" + message.author.id + ">", {embed}).then(msg => {
        msg.react('⬅').then(r => {
          msg.react('➡')
          
          const next = (reaction, user) => reaction.emoji.name === '➡' && user.id === message.author.id;
          const back = (reaction, user) => reaction.emoji.name === '⬅' && user.id === message.author.id;
          
          const nextVerify = msg.createReactionCollector(next, {time: 120000})
          const backVerify = msg.createReactionCollector(back, {time: 120000})
          
          let t = res.data.current_page

          nextVerify.on('collect', r=> {

            let count = res.data.current_page ? args[0] : 0
    
            client.axios.get('/ranking?page='+ (t + 1))
            .then(res => {
              //console.log(res.data)
              const ranking = res.data
              const value = []
              for(let i in ranking.data){
                let rank = ranking.data[i]
                let user =  client.guilds
                .get("452926217558163456")
                .members.get(ranking.data[i].discord_id).user
                value.push( (1 + parseInt(i) + (t * 10)  ) + " | "+ user.username + " | Level: " + rank.level  + " | Exp: " + rank.current_exp)
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
            console.log("Fazendo request para pag " + pag)

            client.axios.get('/ranking?page='+ (t - 1))
            .then(res => {
              let count2 = res.data.current_page * 10;
              //console.log(res.data)
              const ranking = res.data
              const value = []
              for(let i in ranking.data){
                let rank = ranking.data[i]
                let user =  client.guilds
                .get("452926217558163456")
                .members.get(ranking.data[i].discord_id).user
                value.push( (1 + parseInt(i) + (count2 - 10)  ) + " | "+ user.username + " | Level: " + rank.level  + " | Exp: " + rank.current_exp)
              }
              console.log(value)
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
      }).catch(error => console.error)
      
      //message.delete().catch(() => {});
      
    },
    
    get command() { 
      return {
        name: 'react',
        category: 'Users',
        description: 'Lista o mapeamento dos usuários mais ativos',
        usage: 'react',
      };
    },
  };
  