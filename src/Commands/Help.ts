import Ioc from "@core/IoC/Ioc"
import Command from "@core/Contracts/Command"
import Context from "@core/Contracts/Context"

export default class Help extends Command {
  public get description() {
    return "Exibe a lista de comandos disponíveis."
  }

  public help(): string {
    return ":x: Como usar: `!help`"
  }

  public async run({ send }: Context): Promise<void> {
    const commandList = Ioc.use<string[]>("Commands")

    await send(`Comandos disponíveis: ${commandList}`)
  }
}
