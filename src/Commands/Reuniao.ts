import env from "@/env"
import Command from "@core/Contracts/Command"
import Context from "@core/Contracts/Context"
import InvalidArgsException from "@core/Exceptions/InvalidArgs"

export default class Reuniao extends Command {
  public get description() {
    return "Coloca o servidor em modo reunião."
  }

  public get roles(): string[] {
    return [env.ADMIN_ROLE]
  }

  public get roleValidationMessages() {
    return {
      [env.ADMIN_ROLE]: "Apenas administradores podem usar esse comando",
    }
  }

  public help(): string {
    return ":x: Como usar: `!reuniao <on|off>`"
  }

  public validate({ arg }: Context): void | never {
    const states = {
      on: 1,
      off: 2,
    }

    if (!(arg in states)) {
      throw new InvalidArgsException(this.help())
    }
  }

  public async run({ client, arg }: Context): Promise<void> {
    client.channels
      .filter(
        (channel) =>
          !/Reunião/i.test((channel as any).name) &&
          !/My Bot Server/i.test((channel as any).name)
      )
      .forEach((channel) =>
        (channel as any).replacePermissionOverwrites({
          overwrites: client.users.map((user) => ({
            id: user.id,
            denied: arg === "on" ? ["VIEW_CHANNEL"] : [],
          })),
        })
      )
  }
}
