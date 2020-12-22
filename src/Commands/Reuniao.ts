import env from "@/env"
import Command from "@core/Contracts/Command"
import * as yup from "yup"

const command = Command({
  description: "Coloca o servidor em modo reunião.",
  roles: [env.ADMIN_ROLE],
  roleValidationMessages: {
    [env.ADMIN_ROLE]: "Apenas administradores podem usar esse comando",
  },
  help: ":x: Como usar: `!reuniao <on|off>`",
  validate: ({ arg }) =>
    yup
      .string()
      .oneOf(["on", "off"])
      .isValid(arg),
  run: async (_context) => {
    /* redo this
    client.channels
      .filter(
        channel =>
          !/Reunião/i.test((channel as any).name) &&
          !/My Bot Server/i.test((channel as any).name)
      )
      .forEach(channel =>
        (channel as any).replacePermissionOverwrites({
          overwrites: client.users.map(user => ({
            id: user.id,
            denied: arg === "on" ? ["VIEW_CHANNEL"] : [],
          })),
        })
      ) */
  },
})
export default command
