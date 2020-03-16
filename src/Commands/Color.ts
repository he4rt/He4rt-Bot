import env from "@/env"
import Command from "@core/Contracts/Command"
import InvalidArgsException from "@core/Exceptions/InvalidArgs"

const isHex = (value: string): boolean => {
  return parseInt(value, 16).toString(16) === value.toLowerCase()
}

const command = Command({
  description: "Troca a cor do seu nick",
  roles: [env.DONATOR_ROLE],
  roleValidationMessages: {
    [env.DONATOR_ROLE]: "Esse comando está disponivel apenas para apoiadores!",
  },
  help: ":x: Como usar: `!color <hex>` (código hexadecimal da cor)",
  validate: async ({ arg }) => {
    if (!isHex(arg)) {
      throw new InvalidArgsException(command.help)
    }
  },
  run: async ({ arg: color, send, user, createRole }) => {
    const roleName = /.+#\d{4}/i

    if (!user.hasRole(roleName)) {
      const newRole = await createRole({
        name: user.name(),
        mentionable: false,
        position: 60,
        color,
      })

      await Promise.all([
        send(`Cor criada com sucesso! hex(${newRole.color})`),
        user.addRole(newRole),
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
  },
})
export default command
