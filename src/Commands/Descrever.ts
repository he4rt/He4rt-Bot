import bot from "@/Core/Bot"
import Command from "@core/Contracts/Command"
import * as yup from "yup"
import * as embed from "@/Core/Misc/Embeds"
import env from "@/env"

const command = Command({
  description: "Mostra a descrição de um comando.",
  help: ":x: Como usar: `!descrever <comando>`",
  validate: ({ arg }) =>
    yup
      .string()
      .required()
      .isValid(arg),
  run: ({ arg, send }) => {
    const commandToDescribe = bot.getCommand(arg)

    if (!commandToDescribe) {
      return send(bot.getCommandSuggestion(arg))
    }

    const answer = embed
      .info()
      .setTitle(`**${env.COMMAND_PREFIX}${arg}**`)
      .setDescription(command.description)

    return send(answer)
  },
})
export default command
