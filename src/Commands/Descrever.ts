import Command from "@core/Contracts/Command"
import Context from "@core/Contracts/Context"
import InvalidArgsException from "@core/Exceptions/InvalidArgs"
import Ioc from "@core/IoC/Ioc"

export default class Descrever extends Command {
  public get description() {
    return "Mostra a descrição de um comando."
  }

  public help(): string {
    return ":x: Como usar: `!descrever <comando>`"
  }

  public validate(args: string[]): void | never {
    if (args.length === 0) {
      throw new InvalidArgsException(this.help())
    }
  }

  public async run({ args, send }: Context): Promise<void> {
    const command = Ioc.use<Command>(args[0])

    await send(command.description)
  }
}
