import Command from "@core/Contracts/Command"
import Context from "@core/Contracts/Context"
import InvalidArgsException from "@core/Exceptions/InvalidArgs"

export default class Clear extends Command {
  public get description() {
    return "Limpa o chat"
  }

  public get permissions(): string[] {
    return ["MANAGE_GUILD"]
  }

  private isDigit(character: string): boolean {
    return character.split("").every((c) => c >= "0" && c <= "9")
  }

  public validate(args: string[]): void | never {
    if (args.length === 0 || !this.isDigit(args[0])) {
      throw new InvalidArgsException(this.help())
    }

    const messagesToDelete = parseInt(args[0])
    if (messagesToDelete < 1 || messagesToDelete > 100) {
      throw new InvalidArgsException(this.help())
    }
  }

  public help(): string {
    return ":x: Como usar: `!clear <quantidade_mensagens(min:1|max:100)>`"
  }

  public async run({ args, deleteChannelMessages }: Context): Promise<void> {
    const userMessage = 1
    const limit = parseInt(args[0]) + userMessage

    await deleteChannelMessages({ limit })
  }
}
