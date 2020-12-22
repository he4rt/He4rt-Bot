import bot from "@/Core/Bot"
import Command from "@core/Contracts/Command"
import * as yup from "yup"

const command = Command({
  description: "Mostra a descrição de um comando.",
  help: ":x: Como usar: `!descrever <comando>`",
  validate: ({ arg }) =>
    yup
      .string()
      .required()
      .isValid(arg),
  run: async ({ arg, send }) => {
    const commandToDescribe = bot.getCommand(arg)

    const answer =
      commandToDescribe.description ?? bot.getCommandSuggestion(arg)

    await send(answer)
  },
})
export default command
