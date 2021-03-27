import Command from "@core/Contracts/Command"
import env from "@/env"

const command = Command({
  description: "Faz o bot pedir pra pessoa se apresentar.",
  help: ":x: Como usar: `!apresenta @User`",
  run: ({ send, hasMentionedUsers, getMentionedUsers }) => {
    const hasTargetUser = hasMentionedUsers()

    if (!hasTargetUser) {
      return send(`\\❗ É necessário mencionar um usuário!`)
    }

    const targetUser = getMentionedUsers()[0]

    const templateMessage = `<@${targetUser.id}> roda um \`!apresentar\` lá no <#${env.COMMANDS_CHAT}> pra gente!`

    return send(templateMessage)
  },
})

export default command
