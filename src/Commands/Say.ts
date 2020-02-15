import Command from "@core/Contracts/Command"
import Context from "@core/Contracts/Context"
import InvalidArgsException from "@core/Exceptions/InvalidArgs"

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

  public validate(args: string[]): void | never {
    if (args.length === 0) {
      throw new InvalidArgsException(":x: Voce deve informar uma mensagem")
    }
  }

  public async run({ args, send }: Context): Promise<void> {
    await send(args.join(" ").trim())
  }
}
