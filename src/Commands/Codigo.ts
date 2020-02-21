import Command from "@core/Contracts/Command"
import Context from "@core/Contracts/Context"

export default class Codigo extends Command {
  public get description() {
    return "Mostra como formatar o código no chat."
  }

  public help(): string {
    return ":x: Como usar: `!codigo`"
  }

  public async run({ send }: Context): Promise<void> {
    const answer =
      "Formate seu código:\n\\`\\`\\`js\n    CODIGO AQUI\n\\`\\`\\`\nTroque 'js' por sua lang \n```js\n const foo = 10\n```"

    await send(answer)
  }
}
