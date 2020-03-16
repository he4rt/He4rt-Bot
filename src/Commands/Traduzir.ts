import Command from "@core/Contracts/Command"
import InvalidArgsException from "@core/Exceptions/InvalidArgs"
import translate from "@vitalets/google-translate-api"

const command = Command({
  description: "Traduz uma mensagem.",
  help: ":x: Como usar: `!traduzir <language(exemplo: en)> <text>`",
  validate: async ({ args }) => {
    if (args.length < 2) {
      throw new InvalidArgsException(command.help)
    }
  },
  run: async ({ args, send }) => {
    const [to, ...message] = args

    const { text } = await translate(message, { to })

    await send(text)
  },
})
export default command
