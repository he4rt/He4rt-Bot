import { RichEmbed } from "discord.js"

import Command from "@core/Contracts/Command"
import Context from "@core/Contracts/Context"
import InvalidArgsException from "@core/Exceptions/InvalidArgs"

export default class Anunciar extends Command {
  public get description() {
    return "Faz o bot anunciar algo no chat usando @everyone"
  }

  public get permissions(): string[] {
    return ["MANAGE_GUILD"]
  }

  public help(): string {
    return "Como usar: `!anunciar <mensagem>`"
  }

  public validate(args: string[]): void | never {
    if (args.length === 0) {
      throw new InvalidArgsException(this.help())
    }
  }

  public async run({ args, send }: Context): Promise<void> {
    const message = args.join(" ").trim()

    const announcement = new RichEmbed()
      .setTitle("``🔔`` **Heart informa:**")
      .setDescription(message)
      .setColor("#8146DC")
      .setFooter(
        "2019 © He4rt Developers",
        "https://heartdevs.com/wp-content/uploads/2018/12/logo.png"
      )
      .setTimestamp()

    await send("@everyone", announcement)
  }
}
