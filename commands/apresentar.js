const Discord = require('discord.js');

module.exports = {
  run: (client, message, args) => {

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
    const embedLinguagens = new Discord.RichEmbed()
      .setTitle(`**Linguagens?** (Reaja para adquirir seu cargo e prosseguir)`)
      .setDescription(":one:  -  C, C#, C++\n:two: - PYTHON\n:three: - PERL\n:four: - RUBY\n:five: - JAVA\n:six: - PHP\n:seven: - CSS\n:eight: - UX/UI\n:nine: - JAVASCRIPT\n\n✅ - Pronto.")
      .setColor("#36393E")
    const embedIngles = new Discord.RichEmbed()
      .setTitle(`**Nível de inglês?**`)
      .setDescription("🇦 - Básico\n🇧 - Intermediário\n🇨 - Avançado")
      .setColor("#36393E")

    message.channel.send("``❕`` Todas as informações foram enviadas em seu privado.")

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
                if (reaction.emoji.name === '1⃣' && user.id !== client.user.id) {
                  client.guilds.get(process.env.GUILD_ID).members.get(message.author.id).addRole("541021498064896000")
                }
                if (reaction.emoji.name === '2⃣' && user.id !== client.user.id) {
                  client.guilds.get(process.env.GUILD_ID).members.get(message.author.id).addRole('540994295541399552')
                }
                if (reaction.emoji.name === '3⃣' && user.id !== client.user.id) {
                  client.guilds.get(process.env.GUILD_ID).members.get(message.author.id).addRole('540995072246939648')
                }
                if (reaction.emoji.name === '4⃣' && user.id !== client.user.id) {
                  client.guilds.get(process.env.GUILD_ID).members.get(message.author.id).addRole('540995627559944207')
                }
                if (reaction.emoji.name === '5⃣' && user.id !== client.user.id) {
                  client.guilds.get(process.env.GUILD_ID).members.get(message.author.id).addRole('540995379538165774')
                }
                if (reaction.emoji.name === '6⃣' && user.id !== client.user.id) {
                  client.guilds.get(process.env.GUILD_ID).members.get(message.author.id).addRole('540994118634176512')
                }
                if (reaction.emoji.name === '7⃣' && user.id !== client.user.id) {
                  client.guilds.get(process.env.GUILD_ID).members.get(message.author.id).addRole('546152542040490009')
                }
                if (reaction.emoji.name === '8⃣' && user.id !== client.user.id) {
                  client.guilds.get(process.env.GUILD_ID).members.get(message.author.id).addRole('546152565633449995')
                }
                if (reaction.emoji.name === '9⃣' && user.id !== client.user.id) {
                  client.guilds.get(process.env.GUILD_ID).members.get(message.author.id).addRole('540993488410378281')
                }
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
                        .addField("**Linguagens:**", client.guilds.get(process.env.GUILD_ID).members.get(message.author.id).roles.filter(r => r.id !== process.env.GUILD_ID).map(roles => `<@&${roles.id}>`).join(", ") || "\`Nenhuma\`", true)
                        .addField("**Nível de inglês:**", client.guilds.get(process.env.GUILD_ID).members.get(message.author.id).roles.filter(r => r.id !== process.env.GUILD_ID).map(roles => `<@&${roles.id}>`).join(", ") || "\`Nenhuma\`", true)
                        .setFooter("2019 © He4rt Developers", "https://heartdevs.com/wp-content/uploads/2018/12/logo.png")
                        .setTimestamp()
                      if (reaction.emoji.name === '🇦' && user.id !== client.user.id) {
                        msg.delete()
                        client.guilds.get(process.env.GUILD_ID).members.get(message.author.id).addRole(process.env.INGLES_A)
                        client.guilds.get(process.env.GUILD_ID).members.get(message.author.id).addRole(process.env.APRESENTOU_ROLE)
                        client.channels.get("546151895010508827").send(about)
                      }
                      if (reaction.emoji.name === '🇧' && user.id !== client.user.id) {
                        msg.delete()
                        client.guilds.get(process.env.GUILD_ID).members.get(message.author.id).addRole(process.env.INGLES_B)
                        client.guilds.get(process.env.GUILD_ID).members.get(message.author.id).addRole(process.env.APRESENTOU_ROLE)
                        message.channel.send(about)
                        client.channels.get("546151895010508827").send(about)
                      }
                      if (reaction.emoji.name === '🇨' && user.id !== client.user.id) {
                        msg.delete()
                        client.guilds.get(process.env.GUILD_ID).members.get(message.author.id).addRole(process.env.INGLES_C)
                        client.guilds.get(process.env.GUILD_ID).members.get(message.author.id).addRole(process.env.APRESENTOU_ROLE)
                        message.channel.send(about)
                        client.channels.get("546151895010508827").send(about)
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
  },

  get command() {
    return {
      name: 'apresentar',
      category: 'Users',
      description: 'O usuario irá se apresentar.',
      usage: 'apresentar'
    }
  }

}
