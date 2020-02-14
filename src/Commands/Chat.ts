import Command from "@core/Contracts/Command"
import Context from "@core/Contracts/Context"
import InvalidArgsException from "@core/Exceptions/InvalidArgs"

export default class Chat extends Command {
  public get description() {
    return "Ao usar o comando irá ativar ou desativar o chat"
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
    return "Como usar: `!chat <on/off>`"
  }

  public validate(args: string[]): void | never {
    if (args.length === 0 || (args[0] !== "on" && args[0] !== "off")) {
      throw new InvalidArgsException("Você precisa informar **on** ou **off**")
    }
  }

  public async run({ args, send, setRolePermissions }: Context): Promise<void> {
    const SEND_MESSAGES = args[0] === "on"

    await setRolePermissions("@everyone", { SEND_MESSAGES })

    await send(
      SEND_MESSAGES
        ? "``❗`` Este canal foi aberto."
        : "``❗`` Este canal foi pausado."
    )
  }
}
