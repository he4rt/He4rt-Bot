import Command from "@core/Contracts/Command"
import InvalidArgsException from "@core/Exceptions/InvalidArgs"

const isDigit = (character: string): boolean => {
  return character.split("").every((c) => c >= "0" && c <= "9")
}
const command = Command({
  description: "Limpa o chat",
  permissions: ["MANAGE_GUILD"],
  validate: async ({ arg }) => {
    if (isDigit(arg)) {
      throw new InvalidArgsException(command.help)
    }

    const messagesToDelete = parseInt(arg)
    if (messagesToDelete < 1 || messagesToDelete > 100) {
      throw new InvalidArgsException(command.help)
    }
  },
  help: ":x: Como usar: `!clear <quantidade_mensagens(min:1|max:100)>`",
  run: async ({ arg, deleteChannelMessages }) => {
    const userMessage = 1
    const limit = parseInt(arg) + userMessage

    await deleteChannelMessages({ limit })
  },
})
export default command
