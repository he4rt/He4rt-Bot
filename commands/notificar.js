module.exports = {
  run: (client, message, args) => {

    let notifyRole = message.guild.roles.find('name', 'Novidades')

    if (!message.member.roles.exists('name', notifyRole.name)) {
      message.member.addRole(notifyRole)
      return message.channel.send("``❕`` Agora você sempre será notificado quando houver notícias.")
    } else {
      message.member.removeRole(notifyRole)
      return message.channel.send("``❕`` Agora você não será mais notificado quando houver notícias.")
    }
  },

  get command() {
    return {
      name: 'notificar',
      category: 'Users',
      description: 'Adicionar o cargo novidades no usuario.',
      usage: 'notificar'
    }
  }

}
