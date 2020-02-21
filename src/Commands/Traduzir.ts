import Command from "@core/Contracts/Command"
import Context from "@core/Contracts/Context"
import InvalidArgsException from "@core/Exceptions/InvalidArgs"
import translate from "@vitalets/google-translate-api"

export default class Traduzir extends Command {
  public get description() {
    return "Traduz uma mensagem."
  }

  public help(): string {
    return ":x: Como usar: `!traduzir <language(exemplo: en)> <text>`"
  }

  public validate(args: string[]): void | never {
    if (args.length < 2) {
      throw new InvalidArgsException(this.help())
    }
  }

  public async run({ args, send }: Context): Promise<void> {
    const [to, ...message] = args

    const { text } = await translate(message, { to })

    await send(text)
  }
}
