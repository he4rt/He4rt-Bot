const Discord = require('discord.js');
const math = require('mathjs');

module.exports = {
  validate(client, message, args) {
    if (args.join('') === '') {
      throw new Error('invalid_syntax');
    }
  },
  async run(client, message, args) {
    const question = args.join(' ');
    const answer = math.eval(question);

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
