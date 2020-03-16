import env from "@/env"
import Command from "@core/Contracts/Command"
import InvalidArgsException from "@core/Exceptions/InvalidArgs"

const command = Command({
  description: "Ao usar o comando irá ativar ou desativar o chat",
  roles: [env.ADMIN_ROLE],
  roleValidationMessages: {
    [env.ADMIN_ROLE]: "Apenas administradores podem usar esse comando",
  },
  help: ":x: Como usar: `!chat <on/off>`",
  validate: async ({ arg }) => {
    if (arg !== "on" && arg !== "off") {
      throw new InvalidArgsException(command.help)
    }
  },
  run: async ({ arg, send, setRolePermissions }) => {
    const SEND_MESSAGES = arg === "on"

    await setRolePermissions("@everyone", { SEND_MESSAGES })

    await send(
      SEND_MESSAGES
        ? "``❗`` Este canal foi aberto."
        : "``❗`` Este canal foi pausado."
    )
  },
})
export default command
