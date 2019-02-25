const Discord = require('discord.js');

module.exports = {
  run: (client, message, args) => {
    if (!message.member.hasPermission('KICK_MEMBERS')) {
      return message.channel.send(
        '``❌`` Você não possui permissão para utilizar este comando. ``[KICK_MEMBERS]``'
      );
    }

    const member = message.mentions.members.first();
        
        if(!member) return message.reply("Você deve informar um user").then(msg => msg.delete(8000));
        
        if(!member.bannable) return message.channel.send('``❌`` Ocorreu um problema para punir este usuário.')
      );

    const temp = args[1];
    if (!temp)
      return message.channel.send(
        'Você deve informar o tempo do ban (em minutos)'
      );

    const reason = args.slice(2).join(' ');
    if (!reason)
      return message
        .reply('Você deve informar uma razão')
        .then(msg => msg.delete(8000));

    // minutos para ms
        const tempoEmMs = temp * 60000;

    let desbanirTimeStanp = Date.now() + tempoEmMs;

    // banir a pessoa colocando o timestanp no comeco da reason para usar depois
    member
      .ban(
        `[${desbanirTimeStanp}] Motivo: ` +
          reason +
          ` | Punido por: ${message.author.tag}`
      )
      .catch(error =>
        message.channel
          .send('``❌`` Ocorreu um problema para punir este usuário.')
          .then(msg => msg.delete(8000))
      );

    message.channel.send(`O usuario ${member} foi banido por ${temp} minutos`);
  },
    
    get command() {
        return {
            name: 'tempban',
            category: 'mod',
            description: 'Irá banir o usuario temporariamente (tempo um minutos)',
            usage: '!tempban @user 5 motivo',
    };
  },
};
