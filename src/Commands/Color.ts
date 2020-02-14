import Command from "@core/Contracts/Command"
import Context from "@core/Contracts/Context"
import InvalidArgsException from "@core/Exceptions/InvalidArgs"

export default class Color extends Command {
  public get description() {
    return "Troca a cor do seu nick"
  }

  public get roles(): string[] {
    return [process.env.DONATOR_ROLE!]
  }

  public get roleValidationMessages() {
    return {
      [process.env
        .DONATOR_ROLE!]: "Esse comando está disponivel apenas para apoiadores!"
    }
  }

  public help(): string {
    return "Como usar: `!color <hex>` (código hexadecimal da cor)"
  }

  private isHex(value: string): boolean {
    return parseInt(value, 16).toString(16) === value.toLowerCase()
  }

  public validate(args: string[]): void | never {
    if (args.length === 0 || !this.isHex(args[0])) {
      throw new InvalidArgsException(
        ":x: Você precisa informar o codigo hexadecimal (!color `hex`)"
      )
    }
  }

  public async run({ args, send, user, createRole }: Context): Promise<void> {
    const [color] = args

    const roleName = /.+#\d{4}/i

    if (!user.hasRole(roleName)) {
      const newRole = await createRole({
        name: user.name(),
        mentionable: false,
        position: 60,
        color
      })

      await Promise.all([
        send(`Cor criada com sucesso! hex(${newRole.color})`),
        user.addRole(newRole)
      ])

      return
    }

    const role = user.role(roleName)

    const username = user.name()
    if (role.name !== username) {
      await role.setName(username)
    }

    const newRole = await role.setColor(color)
    await send(`Cor atualizada com sucesso! hex(${newRole.color})`)
  }
}