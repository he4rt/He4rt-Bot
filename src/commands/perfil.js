const moment = require('moment');
const util = require('../util');

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
  online: '<:online:552507515917565954> Online',
  idle: '<:idle:552507516106309632> Ausente',
  dnd: '<:dnd:552507516324544532> Ocupado',
  offline: '<:offline:552507516332933120> Offline',
};

module.exports = {
  async run(client, message) {
    const member = message.mentions.users.first() || message.author;
    const userID = member.id;

    const { data: user } = await client.axios.get(`/users/${userID}`);

    const engRoles =
      client.guilds
        .get(process.env.GUILD_ID)
        .members.get(member.id)
        .roles.filter(role => hiddenRolesEng.includes(role.id))
        .map(role => `<@&${role.id}>`)
        .join(', ') || '`Nenhuma`';
    const devRoles =
      client.guilds
        .get(process.env.GUILD_ID)
        .members.get(member.id)
        .roles.filter(role => hiddenRolesDev.includes(role.id))
        .map(role => `<@&${role.id}>`)
        .join(', ') || '`Nenhuma`';

    const answer = util.translate('perfil.answer', [
      user.name ? `${member.username} (${user.name})` : `${member.username}`,
      user.about || 'Desconhecido',
      user.git || 'Desconhecido',
      status[member.presence.status] || 'Desconhecido',
      user.level || 'Desconhecido',
      user.current_exp || 'Desconhecido',
      `<:hcoin:548969665020297216> ${user.money}`,
      devRoles || 'Desconhecido',
      engRoles || 'Desconhecido',
      `${moment(member.joinedAt).format('LLLL')} **#${user.id}**`,
    ]);
    answer.setThumbnail(member.avatarURL);
    answer.setFooter(
      `Comando utilizado por: ${message.author.tag}`,
      'https://heartdevs.com/wp-content/uploads/2018/12/logo.png'
    );
    answer.setTimestamp();

    await message.channel.send(answer);
  },

  get command() {
    return {
      name: 'profile',
      category: 'Users',
      description: 'Irá mostrar o perfil de um usuario.',
      usage: 'avatar',
    };
  },
};
