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
    return ":x: Como usar: `!chat <on/off>`"
  }

  public validate({ arg }: Context): void | never {
    if (arg !== "on" && arg !== "off") {
      throw new InvalidArgsException(this.help())
    }
  }

  public async run({ arg, send, setRolePermissions }: Context): Promise<void> {
    const SEND_MESSAGES = arg === "on"

    await setRolePermissions("@everyone", { SEND_MESSAGES })

    await send(
      SEND_MESSAGES
        ? "``❗`` Este canal foi aberto."
        : "``❗`` Este canal foi pausado."
    )
  }
}
