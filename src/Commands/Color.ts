import env from "@/env"
import Command from "@core/Contracts/Command"
import * as yup from "yup"

const isHex = (value: string): boolean => {
  const hexNumber = value.replace("#", "")

  return parseInt(hexNumber, 16).toString(16) === hexNumber.toLowerCase()
}

const command = Command({
  description: "Troca a cor do seu nick",
  roles: [env.DONATOR_ROLE],
  roleValidationMessages: {
    [env.DONATOR_ROLE]: "Esse comando está disponivel apenas para apoiadores!",
  },
  help: ":x: Como usar: `!color <#hex>` (código hexadecimal da cor)",
  validate: ({ arg }) =>
    yup
      .string()
      .required()
      .matches(/^#/)
      .min(4)
      .max(7)
      .test(() => isHex(arg))
      .isValid(arg),
  run: async ({ arg: color, send, user, createRole }) => {
    const role = user.getRole(user.name)

    if (!role) {
      const newRole = await createRole({
        name: user.name,
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

    await role.setColor(color)

    await send(`Cor atualizada com sucesso! hex(${color})`)
  },
})
export default command
