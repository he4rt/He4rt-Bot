import Command from "@core/Contracts/Command"
import translate from "@vitalets/google-translate-api"
import * as yup from "yup"

const command = Command({
  description: "Traduz uma mensagem.",
  help: ":x: Como usar: `!traduzir <language(exemplo: en)> <text>`",
  validate: ({ args }) =>
    yup
      .array()
      .min(2)
      .required()
      .isValid(args),
  run: async ({ args, send }) => {
    const [to, ...message] = args

    const { text } = await translate(message, { to })

    await send(text)
  },
})
export default command
