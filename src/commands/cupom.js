const Discord = require('discord.js');

module.exports = {
    async run(client, message, args) {


        const member = message.member;

        var coupon = args[0];
        if(coupon){
 
            if(coupon == "generate"){

                var prize = args[1];
                var type = args[2];

                if(!prize || !type){
                    return  message.channel.send("``❌`` Utilize: !cupom generate <valor> <exp/coin>.");
                }



            } else {

            client.axios.post(`/users/${member.id}/coupon`, {coupon: coupon}).then(res => {

            var type = res.data.coupon.type_id == "1" ? "exp" : "HCoins";

            const embed = new Discord.RichEmbed()
            .setTitle('``👑`` » !cupom')
            .setColor('#8146DC')
            .setDescription("Cupom utilizado com sucesso.\n\nVocê ganhou: `` "+res.data.coupon.value+" "+type+"``.")
            .setFooter(
              `Comando utilizado por: ${message.author.tag}`,
              'https://heartdevs.com/wp-content/uploads/2018/12/logo.png'
            )
            .setTimestamp();
    
            message.channel.send(embed);
        
            }).catch(err =>  {

                const embed = new Discord.RichEmbed()
                .setTitle('``❌`` » !cupom')
                .setColor('#8146DC')
                .setDescription("Você já utilizou esse cupom ou ele não existe.")
                .setFooter(
                  `Comando utilizado por: ${message.author.tag}`,
                  'https://heartdevs.com/wp-content/uploads/2018/12/logo.png'
                )
                .setTimestamp();
        
                message.channel.send(embed);

            });  

            }
            
        } else {

            message.channel.send("``❌`` Utilize: !cupom <cupom>.");

        }

        
        
    },
  
    get command() {
      return {
        name: 'cupom',
        category: 'Admin, mod etc..',
        description: 'Descrição do Comando',
        usage: 'comando',
      };
    },
  };
  