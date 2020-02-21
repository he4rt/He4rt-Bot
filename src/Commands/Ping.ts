import Command from "@core/Contracts/Command"
import Context from "@core/Contracts/Context"

export default class Ping extends Command {
  public get description() {
    return "Mostra a latência do bot"
  }

  public help(): string {
    return ":x: Como usar: `!ping`"
  }

  public async run({ send, client }: Context): Promise<void> {
    await send(`\`\`📡\`\` Latência da API: ${Math.round(client.ping)}ms.`)
  }
}
