import env from "@/env"
import Command from "@core/Contracts/Command"
import * as yup from "yup"

const command = Command({
  description: "Manda uma mensagem pelo bot para cada usuário do servidor.",
  roles: [env.ADMIN_ROLE],
  roleValidationMessages: {
    [env.ADMIN_ROLE]: "Apenas administradores podem usar esse comando.",
  },
  help: ":x: Como usar: `!sayall <message>`",
  validate: ({ args }) =>
    yup
      .array()
      .min(1)
      .required()
      .isValid(args),
  run: async ({ args, send, getMembers }) => {
    const message = args.join(" ")

    await send(
      "Enviando mensagem para todos os usuários...\n``❗`` Vai retornar algum erro."
    )

    const members = await getMembers()

    await Promise.all(members.map((member) => member.send(message)))
  },
})
export default command
