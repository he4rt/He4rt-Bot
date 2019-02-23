const Discord = require('discord.js');
const math = require('mathjs');

module.exports = {
  run: (client, message, args) => {
    // TODO: verificar o que fazer com possivel erro
    message.delete().catch(() => {});

    const input = args.join(' ');
    if (!input) {
      return message.channel
        .send('``❌`` Utilize ``!calcular [cálculo]``.')
        .then(msg => msg.delete(8000));
    }

    const question = args.join(' ');
    let answer;

    try {
      answer = math.eval(question);
    } catch (err) {
      return message.channel
        .send('``❌`` Utilize ``!calcular [cálculo]``.')
        .then(msg => msg.delete(8000));
    }

    const embed = new Discord.RichEmbed()
      .setTitle('``➗`` » !calcular')
      .setColor('#8146DC')
      .addField('**Cálculo:**', question)
      .addField('**Resposta:**', answer)
      .setFooter(
        `Comando utilizado por: ${message.author.tag}`,
        'https://heartdevs.com/wp-content/uploads/2018/12/logo.png'
      )
      .setTimestamp();
    return message.channel.send(embed);
  },

  get command() {
    return {
      name: 'calcular',
      category: 'Users',
      description: 'Irá mostrar o avatar de um usuario.',
      usage: 'calcular',
    };
  },
};
