const Discord = require('discord.js');
const roles = require('../assets/roles.json')
module.exports = {
  run: (client, message, args) => {
    
    const hidden_roles = [
      "541021498064896000","546152565633449995","546152542040490009","540994118634176512",
      "540995379538165774","540995627559944207","540995072246939648","452927819757125663",
      "540994295541399552","540993488410378281","546150872397119491","512389942354378772",
      "452927657634693130","543317837222117396",process.env.GUILD_ID
    ]

  

    const embedName = new Discord.RichEmbed()
      .setTitle(`**Qual é seu nome?** (Exemplo: Daniel Reis)`)
      .setColor("#36393E")
    const embedNick = new Discord.RichEmbed()
      .setTitle(`**Qual é seu nick?** (Exemplo: DanielHe4rt)`)
      .setColor("#36393E")
    const embedAbout = new Discord.RichEmbed()
      .setTitle(`**Diga um pouco sobre você:** (Exemplo: Me chamo Gustavo...)`)
      .setColor("#36393E")
    const embedGit = new Discord.RichEmbed()
      .setTitle(`**Qual é seu Git?** (Exemplo: https://github.com/DanielHe4rt)`)
      .setColor("#36393E")

    let devRoles = roles.dev_roles
    let engRoles = roles.eng_roles
    let langString = ""
    for(let i in devRoles){
      langString += devRoles[i].react  + "  -  " + devRoles[i].name + "\n"
    }
    langString += "\n\n✅ - Pronto."
    
    const embedLinguagens = new Discord.RichEmbed()
      .setTitle(`**Linguagens?** (Reaja para adquirir seu cargo e prosseguir)`)
      .setDescription(langString)
      .setColor("#36393E")
    langString = ""
    for(let i in engRoles){
      langString += engRoles[i].react  + "  -  " + engRoles[i].name + "\n"
    }
    const embedIngles = new Discord.RichEmbed()
      .setTitle(`**Nível de inglês?**`)
      .setDescription(langString)
      .setColor("#36393E")


    
    let presentedRole = client.guilds.get(process.env.GUILD_ID).roles.find('name', 'Apresentou')

    if (!client.guilds.get(process.env.GUILD_ID).members.get(message.author.id).roles.exists('name', presentedRole.name)) {

      let collectorName = message.channel.createMessageCollector(m => m.author.id === message.author.id, {
        time: 30000
      });
      
      message.author.send(embedName)
      collectorName.on("collect", () => {
        collectorName.stop()

        let collectorNick = message.channel.createMessageCollector(m => m.author.id === message.author.id, {
          time: 30000
        });
        message.author.send(embedNick)
        collectorNick.on("collect", () => {
          collectorNick.stop()

          let collectorAbout = message.channel.createMessageCollector(m => m.author.id === message.author.id, {
            time: 30000
          });
          message.author.send(embedAbout)
          collectorAbout.on("collect", () => {
            collectorAbout.stop()

            let collectorGit = message.channel.createMessageCollector(m => m.author.id === message.author.id, {
              time: 30000
            });
            message.author.send(embedGit)
            collectorGit.on("collect", () => {
              collectorGit.stop()

              message.author.send(embedLinguagens).then(async (msg) => {
                await msg.react('1⃣');
                await msg.react('2⃣');
                await msg.react('3⃣');
                await msg.react('4⃣');
                await msg.react('5⃣');
                await msg.react('6⃣');
                await msg.react('7⃣');
                await msg.react('8⃣');
                await msg.react('9⃣');
                await msg.react('✅');
                client.on('messageReactionAdd', (reaction, user) => {
                  if (user.bot) return;
                  client.on('messageReactionAdd', (reaction, user) => {
                    if (user.bot) return;
                    for(let i in devRoles){
                      if(reaction.emoji.name === devRoles[i].emoji && user.id !== client.user.id){
                        console.log("Lang",devRoles[i].name)
                        client.guilds.get(process.env.GUILD_ID).members.get(message.author.id).addRole(devRoles[i].id)
                        message.author.send("``✅`` Linguagem adicionada com sucesso!")
                      }
                    }
                  })
                  if (reaction.emoji.name === '✅' && user.id !== client.user.id) {
                    msg.delete()
                    message.author.send(embedIngles).then(async (msg) => {
                      await msg.react('🇦');
                      await msg.react('🇧');
                      await msg.react('🇨');
                      client.on('messageReactionAdd', (reaction, user) => {
                        if (user.bot) return;
                        const about = new Discord.RichEmbed()
                          .setTitle("**Apresentação** » " + message.author.username)
                          .addField("**Sobre:**", collectorAbout.collected.first().content)
                          .setThumbnail(message.author.avatarURL)
                          .setColor("#8146DC")
                          .addField("**Nome:**", collectorName.collected.first().content, true)
                          .addField("**Nickname:**", collectorNick.collected.first().content, true)
                          .addField("**Git:**", collectorGit.collected.first().content, true)
                          .addField("**Linguagens:**", client.guilds.get(process.env.GUILD_ID).members.get(message.author.id).roles.filter(r => r.id !== process.env.GUILD_ID && r.id !== "546148712833875985" && r.id !== "546148711416332298" && r.id !== "546148708077666315" && r.id !== "546150872397119491" && r.id !== "512389942354378772" && r.id !== "452927657634693130" && r.id !== "452927819757125663").map(roles => `<@&${roles.id}>`).join(", ") || "\`Nenhuma\`", true)
                          .addField("**Nível de inglês:**", client.guilds.get(process.env.GUILD_ID).members.get(message.author.id).roles.filter(r => {
                            return !hidden_roles.includes(r.id)
                          }).map(roles => `<@&${roles.id}>`).join(", ") || "\`Nenhuma\`", true)
                          .setFooter("2019 © He4rt Developers", "https://heartdevs.com/wp-content/uploads/2018/12/logo.png")
                          .setTimestamp()
                        for(let i in engRoles){
                          if (reaction.emoji.name === engRoles[i].react && user.id !== client.user.id) {
                            client.guilds.get(process.env.GUILD_ID).members.get(message.author.id).addRole(engRoles[i].id)
                            client.channels.get(process.env.APRESENTACAO_CHAT).send(about)
                            client.guilds.get(process.env.GUILD_ID).members.get(message.author.id).addRole(process.env.APRESENTOU_ROLE)
                            msg.delete()
                            break;
                          }
                        }
                      });
                    });
                  }
                });
              });
            });
          });
        });
      });
    } else {
      return message.channel.send("``❌`` Você já se apresentou.").then(msg => msg.delete(8000));
    }
  },

  get command() {
    return {
      name: 'continuar',
      category: 'Users',
      description: 'O usuario irá continuiar a apresentação.',
      usage: 'continuar'
    }
  }

}
