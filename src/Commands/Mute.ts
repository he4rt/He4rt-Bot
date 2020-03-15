import { RichEmbed } from "discord.js"

import Command from "@core/Contracts/Command"
import Context from "@core/Contracts/Context"
import InvalidArgsException from "@core/Exceptions/InvalidArgs"

export default class Mute extends Command {
  public get description() {
    return "Muta um usuário"
  }

  public get permissions(): string[] {
    return ["BAN_MEMBERS"]
  }

  public help(): string {
    return ":x: Como usar: `!mute <nick> <motivo>`"
  }

  public validate({ args, hasMentionedUsers }: Context): void | never {
    if (!hasMentionedUsers() || args.length <= 2) {
      throw new InvalidArgsException(this.help())
    }
  }

  public async run({
    args,
    send,
    user,
    getMentionedUsers,
    textChannels
  }: Context): Promise<void> {
    const [userToMute] = getMentionedUsers()

    userToMute.addRole(process.env.MUTED_ROLE!)

    const muteReason = args.join(" ").trim()

    const infoEmbed = new RichEmbed()
      .setTitle("``🚔`` » Punição")
      .addField("``👤`` **Usuário mutado:**", userToMute.user, true)
      .addField("``👮`` **Mutado por:**", user.name(), true)
      .addField("``📄`` **Tipo:**", "Mute", true)
      .addField("``📣`` **Motivo:**", muteReason, true)
      .setThumbnail(userToMute.user.avatarURL)
      .setColor("#8146DC")
      .setFooter(
        "2019 © He4rt Developers",
        "https://heartdevs.com/wp-content/uploads/2018/12/logo.png"
      )
      .setTimestamp()

    await send(
      new RichEmbed()
        .setTitle("``✅`` Usuário mutado com sucesso.")
        .addField("**Motivo: **", muteReason, true)
    )

    await Promise.all([
      userToMute.send("Você foi mutado, mais informações abaixo.", infoEmbed),
      textChannels.get(process.env.PUNISHMENT_CHAT!)!.send(infoEmbed)
    ])
  }
}
