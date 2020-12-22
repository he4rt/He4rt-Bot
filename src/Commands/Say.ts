import env from "@/env"
import Command from "@core/Contracts/Command"
import * as yup from "yup"

const command = Command({
  description: "Manda uma mensagem pelo bot.",
  roles: [env.ADMIN_ROLE],
  roleValidationMessages: {
    [env.ADMIN_ROLE]: "Apenas administradores podem usar esse comando",
  },
  help: ":x: Como usar: `!say <message>`",
  validate: ({ args }) =>
    yup
      .array()
      .min(1)
      .required()
      .isValid(args),
  run: ({ args, send }) => send(args.join(" ").trim()),
})
export default command
