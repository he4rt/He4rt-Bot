const Discord = require('discord.js');

module.exports = {
   run:  (client, message, args) => {
    const page = args[0] ? args[0] : 1
    let count = args[0] ? args[0] : 0
    count = count * 10
    console.log(count)
    client.axios.get('/ranking?page='+ page)
    .then(res => {
        console.log(res.data)
        const ranking = res.data
        const value = []
        for(let i in ranking.data){
            let rank = ranking.data[i]
            let user =  client.guilds
            .get(process.env.GUILD_ID)
            .members.get(ranking.data[i].discord_id).user
            value.push( (1 + parseInt(i) + (count - 10)  ) + " | "+ user.username + " | Level: " + rank.level  + " | Exp: " + rank.current_exp)
        }


        const embed = new Discord.RichEmbed()
        .setTitle("Rankingzera")
        .setAuthor(client.user.username, client.user.avatarURL)
        .setColor(0x00AE86)
        .setDescription("This is the main body of text, it can hold 2048 characters.")
        .setTimestamp()
        .setFooter(
            '2019 © He4rt Developers',
            'https://heartdevs.com/wp-content/uploads/2018/12/logo.png'
        )

        .addField("Pagina "+ page + " de " + ranking.lastPage, value, true)
        message.channel.send({embed});
    }).catch(res => console.log("deu merda no ranking"))
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
