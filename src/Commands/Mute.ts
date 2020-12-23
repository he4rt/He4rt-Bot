import env from "@/env"
import Command from "@core/Contracts/Command"
import * as embed from "@/Core/Misc/Embeds"
import * as yup from "yup"
import { permissions } from "@core/Misc/Permissions"

const command = Command({
  description: "Muta um usuário",
  permissions: [permissions.BAN_MEMBERS],
  help: ":x: Como usar: `!mute <nick> <motivo>`",
  validate: ({ args, hasMentionedUsers }) =>
    yup
      .array()
      .min(1)
      .required()
      .test(hasMentionedUsers)
      .isValid(args),
  run: async ({ args, send, user, getMentionedUsers, textChannels }) => {
    const punishmentChannel = textChannels.get(env.PUNISHMENT_CHAT)

    if (!punishmentChannel) {
      await send("Canal de punições não encontrado")
      return
    }

    const [userToMute] = getMentionedUsers()

    await userToMute.addRole(env.MUTED_ROLE)

    const muteReason = args.join(" ").trim()

    const punishmentEmbed = embed
      .info()
      .setTitle("``🚔`` » Punição")
      .addFields(
        { name: "``👤`` **Usuário mutado:**", value: userToMute.name },
        { name: "``👮`` **Mutado por:**", value: user.name },
        { name: "``📄`` **Tipo:**", value: "Mute" },
        { name: "``📣`` **Motivo:**", value: muteReason }
      )

    const avatarUrl = userToMute.avatarURL()

    if (avatarUrl) {
      punishmentEmbed.setThumbnail(avatarUrl)
    }

    const channelEmbed = embed
      .info()
      .setTitle("``✅`` Usuário mutado com sucesso.")
      .addFields({ name: "**Motivo: **", value: muteReason })

    await Promise.all([
      send(channelEmbed),
      userToMute.sendDirectMessage(
        "Você foi mutado, mais informações abaixo.",
        punishmentEmbed
      ),
      punishmentChannel.send(punishmentEmbed),
    ])
  },
})
export default command
