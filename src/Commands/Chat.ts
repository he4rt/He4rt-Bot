import env from "@/env"
import Command from "@core/Contracts/Command"
import * as yup from "yup"

const command = Command({
  description: "Ao usar o comando irá ativar ou desativar o chat",
  roles: [env.ADMIN_ROLE],
  roleValidationMessages: {
    [env.ADMIN_ROLE]: "Apenas administradores podem usar esse comando",
  },
  help: ":x: Como usar: `!chat <on/off>`",
  validate: ({ arg }) =>
    yup
      .string()
      .oneOf(["on", "off"])
      .required()
      .isValid(arg),
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
