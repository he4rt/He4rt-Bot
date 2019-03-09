const Discord = require('discord.js');

module.exports = {
   run:  (client, message, args) => {

    if(args[0] < 1 || args[0].includes(",") || args[0].includes("-") || args[0].includes("*") || isNaN(args[0])) return message.channel.send("Tem q ser maior que 0");
    
    const page = args[0] ? args[0] : 1
    let count = args[0] ? args[0] : 0
    count = count * 10
    client.axios.get('/ranking?page='+ page)
    .then(res => {
      
      if(res.data.data[0] == null) return message.channel.send("Essa pagina nao existe");
      
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
        message.channel.send({embed});
    }).catch(error => console.log(error))

    //message.delete().catch(() => {});

  },

  get command() {
    return {
      name: 'ranking',
      category: 'Users',
      description: 'Lista o mapeamento dos usuários mais ativos',
      usage: 'avatar',
    };
  },
};
