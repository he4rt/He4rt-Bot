import Command from "@core/Command"
import Context from "@core/Context"

export default class Say extends Command {
  static get description() {
    return "Faz o bot dizer algo no chat."
  }

  static get permissions() {
    // retorna as permissões necessárias?
    // pra ser usado dps
    return "test"
  }

  public async help(): Promise<string> {
    return "Como usar: `!say hello world`"
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async run(ctx: Context): Promise<void> {}
}
