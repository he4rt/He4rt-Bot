import Command from "@core/Contracts/Command"
import * as yup from "yup"
import * as embed from "@/Core/Misc/Embeds"
import { permissions } from "@/Core/Misc/Permissions"

const command = Command({
  description: "Faz o bot anunciar algo no chat usando everyone",
  permissions: [permissions.MANAGE_GUILD],
  help: ":x: Como usar: `!anunciar <mensagem>`",
  validate: ({ args }) =>
    yup
      .array()
      .min(1)
      .required()
      .isValid(args),
  run: async ({ args, send }) => {
    const message = args.join(" ").trim()

    const announcement = embed
      .info()
      .setTitle("``🔔`` **Heart informa:**")
      .setDescription(message)

    await send("@everyone", announcement)
  },
})
export default command
