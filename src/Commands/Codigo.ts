import Command from "@core/Command"
import Context from "@core/Context"

export default class Codigo extends Command {
  static get description() {
    return "Mostra como formatar o código no chat."
  }

  public async help(): Promise<string> {
    return "Como usar: `!codigo`"
  }

  public async run({ message }: Context): Promise<void> {
    const answer =
      "Formate seu código:\n\\`\\`\\`js\n    CODIGO AQUI\n\\`\\`\\`\nTroque 'js' por sua lang"

    await message.channel.send(answer)
  }
}
