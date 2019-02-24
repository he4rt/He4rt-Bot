module.exports = {
    run: (client, message, args) => {
        if(message.guild && message.member.hasPermission("MANAGE_GUILD")) {
            const user = args[0];
            if (!user) return message.reply('Você precisa informar um usuario.').catch(console.error);

            const reason = args.slice(1).join(' ');
            if(!reason) return message.channel.send("Você deve informar uma razão");

            client.unbanReason = reason;
            client.unbanAuth = message.author;
            
            message.guild.unban(user).then(() => {
                message.reply(`Usuario <@${user}> foi desbanido com sucesso ! \nRazão: ${reason}`);
            }).catch((e) => {
                if(e.code == "50035") {
                    message.reply("Esse usuario não está banido")
                } else {console.error}
            });
        }
    },

    get command() {
        return {
            name: 'unban',
            category: 'moderate',
            description: 'unban command',
            usage: 'unban @nick',
        };
    },
};
