module.exports = {
  run: (client, message, args) => {
    message.delete().catch((O_o) => {});

    if (!message.member.roles.exists('id', process.env.NOTIFY_ROLE)) {
      message.member.addRole(process.env.NOTIFY_ROLE);
      return message.channel.send('``❕`` Agora você sempre será notificado quando houver notícias.');
    }
    message.member.removeRole(process.env.NOTIFY_ROLE);
    return message.channel.send('``❕`` Agora você não será mais notificado quando houver notícias.');
  },

  get command() {
    return {
      name: 'notificar',
      category: 'Users',
      description: 'Adicionar o cargo novidades no usuario.',
      usage: 'notificar',
    };
  },

};
