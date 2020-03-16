import env from "@/env"
import Command from "@core/Contracts/Command"
import InvalidArgsException from "@core/Exceptions/InvalidArgs"

const command = Command({
  description: "Manda uma mensagem pelo bot.",
  roles: [env.ADMIN_ROLE],
  roleValidationMessages: {
    [env.ADMIN_ROLE]: "Apenas administradores podem usar esse comando",
  },
  help: ":x: Como usar: `!say <message>`",
  validate: async ({ args }) => {
    if (args.length === 0) {
      throw new InvalidArgsException(command.help)
    }
  },
  run: async ({ args, send }) => {
    await send(args.join(" ").trim())
  },
})
export default command
