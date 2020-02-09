import { Message } from "discord.js"

import Command from "@core/Contracts/Command"
import Context from "@core/Contracts/Context"

export default class Say extends Command {
  public get description() {
    return "Manda uma mensagem pelo bot."
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
    return "Como usar: `!say hello world`"
  }

  public async run({ args, reply, send }: Context): Promise<void> {
    if (args.length === 0) {
      const message = await reply(":x: Voce deve informar uma mensagem")
      ;(message as Message).delete(5000)
      return
    }

    await send(args.join(" ").trim())
  }
}
