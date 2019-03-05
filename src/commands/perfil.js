const Discord = require('discord.js');
var moment = require('moment');
moment.locale('pt-BR');

const hiddenRolesDev = [
    '540994118634176512',
    '540994295541399552',
    '540995072246939648',
    '540995379538165774',
    '540995627559944207',
    '541021498064896000',
    '540993488410378281',
    '546152565633449995',
  ];
  
  const hiddenRolesEng = [
    '546148712833875985',
    '546148711416332298',
    '546148708077666315',
  ];

  const status = {
    online: "<:online:552507515917565954> Online",
    idle: "<:idle:552507516106309632> Ausente",
    dnd: "<:dnd:552507516324544532> Ocupado",
    offline: "<:offline:552507516332933120> Offline"
  }

module.exports = {
    run: (client, message, args) => {
        if(message.author.bot) return;
        const member = message.mentions.users.first() || message.author;
        const userID = member.id;
        
        client.axios.get(`/users/${userID}`) 
        .then((res) =>{
            if(res.status == 200) {
                const level = res.data.level;
                const xp = res.data.current_exp;
                const hcoins = res.data.money;
                const engRoles = client.guilds.get("452926217558163456").members.get(member.id).roles.filter(role => hiddenRolesEng.includes(role.id)).map(role => `<@&${role.id}>`).join(', ') || '`Nenhuma`';
                const devRoles = client.guilds.get("452926217558163456").members.get(member.id).roles.filter(role => hiddenRolesDev.includes(role.id)).map(role => `<@&${role.id}>`).join(', ') || '`Nenhuma`';

                const info = new Discord.RichEmbed()
                    .setTitle('``👥`` » !perfil') 
                    .setThumbnail(member.avatarURL)
                    .addField('**Nome:**', member.username, true)
                    .addField('**ID:**', member.id, true)
                    .addField('**Status:**', `${status[member.presence.status]}`, true)
                    .addField('**Nível:**', level, true)
                    .addField('**Experiência:**', xp, true)
                    .addField('**HCoins:**', "<:hcoin:548969665020297216> " + hcoins, true) 
                    .addField('**Linguagens:**', devRoles, true)
                    .addField('**Nível de inglês:**', engRoles, true)
                    .addField('**Juntou-se:**', moment(member.joinedAt).format('LLLL') + " **#" + res.data.id + "**")
                    .setColor('#8146DC')
                    .setFooter(
                        `Comando utilizado por: ${message.author.tag}`,
                        'https://heartdevs.com/wp-content/uploads/2018/12/logo.png'
                    )
                    .setTimestamp();
                
                message.channel.send(info);
                
            } else {
                message.channel.send("``❌`` Algo deu errado, tente novamente.")
            }
        })
        .catch((error) => {
            console.log(error);
        });
    },
    
    get command() {
        return {
            name: 'perfil',
            category: 'Users',
            description: 'Irá mostrar o perfil de um usuario.',
            usage: 'avatar',
        };
    },
};
