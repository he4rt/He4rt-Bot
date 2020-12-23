import Command from "@core/Contracts/Command"
import * as embed from "@/Core/Misc/Embeds"

const command = Command({
  description: "Irá mostrar o avatar de um usuário.",
  help: ":x: Como usar: `!avatar [@user]`",
  run: async ({ send, user, getMentionedUsers }) => {
    const [userToGetAvatarFrom = user] = getMentionedUsers()

    const avatarUrl = userToGetAvatarFrom.avatarURL()

    if (!avatarUrl) {
      await send(`O usuário ${userToGetAvatarFrom.name} não possui um avatar`)
      return
    }

    const answer = embed
      .info()
      .setTitle("``🖼️`` » !avatar")
      .setDescription(`**[Clique aqui](${avatarUrl})** para baixar a imagem!`)
      .setImage(avatarUrl)

    await send(answer)
  },
})
export default command
