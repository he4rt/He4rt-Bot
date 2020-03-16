import env from "@/env"
import Command from "@core/Contracts/Command"
import Context from "@core/Contracts/Context"
import InvalidArgsException from "@core/Exceptions/InvalidArgs"

export default class SayAll extends Command {
  public get description() {
    return "Manda uma mensagem pelo bot para cada usuário do servidor."
  }

  public get roles(): string[] {
    return [env.ADMIN_ROLE]
  }

  public get roleValidationMessages() {
    return {
      [env.ADMIN_ROLE]: "Apenas administradores podem usar esse comando.",
    }
  }

  public help(): string {
    return ":x: Como usar: `!sayall <message>`"
  }

  public validate({ args }: Context): void | never {
    if (args.length === 0) {
      throw new InvalidArgsException(this.help())
    }
  }

  public async run({ args, send, members }: Context): Promise<void> {
    const message = args.join(" ")

    await send(
      "Enviando mensagem para todos os usuários...\n``❗`` Vai retornar algum erro."
    )

    await Promise.all(members().map((member) => member.send(message)))
  }
}
