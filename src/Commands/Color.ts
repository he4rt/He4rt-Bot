import Command from "@core/Contracts/Command"
import Context from "@core/Contracts/Context"

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

  public async run({ args, send, message, member }: Context): Promise<void> {
    const hex = args[0]

    if (!hex) {
      await send(
        ":x: Você precisa informar o codigo hexadecimal (!color `hex`)"
      )
      return
    }

    const nick = message.author.tag
    const role = member.roles.find((r) => /.+#\d{4}/i.test(r.name))

    // Cria a role
    if (!role) {
      try {
        const newRole = await message.guild.createRole({
          name: nick,
          color: hex,
          mentionable: false,
          position: 60
        })

        await send(`Cor criada com sucesso! hex(${newRole.color})`)
        await member.addRole(newRole)
        return
      } catch (error) {
        send("``❌`` Cor invalida!")
        return
      }
    }

    if (role.name !== nick) {
      await role.setName(nick)
    }

    // Autaliza a role
    try {
      const newRole = await role.setColor(hex)
      await send(`Cor atualizada com sucesso! hex(${newRole.color})`)
      return
    } catch (error) {
      send("``❌`` Cor invalida!")
    }
  }
}