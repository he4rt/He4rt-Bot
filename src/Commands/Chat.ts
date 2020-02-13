import { GuildChannel } from "discord.js"

import Command from "@core/Contracts/Command"
import Context from "@core/Contracts/Context"

export default class Chat extends Command {
  public get description() {
    return "Ao usar o comando irá ativar ou desativar o chat"
  }

  public get roles(): string[] {
    return [process.env.ADMIN_ROLE!]
  }

  public get roleValidationMessages() {
    return {
      [process.env
        .ADMIN_ROLE!]: "Apenas administradores podem usar esse comando"
    }
  }

  public help(): string {
    return "Como usar: `!chat <on/off>`"
  }

  public async run({ args, reply, send, message }: Context): Promise<void> {
    if (!args[0]) {
      await send("Você precisa informar **on** ou **off**")
      return
    }

    const SEND_MESSAGES = args[0] === "on"
    const channel = message.channel as GuildChannel

    await channel.overwritePermissions(
      message.guild.roles.find((role) => role.name === "@everyone"),
      { SEND_MESSAGES }
    )

    if (SEND_MESSAGES) {
      await send("``❗`` Este canal foi aberto.")
      return
    }

    await send("``❗`` Este canal foi pausado.")
  }
}
