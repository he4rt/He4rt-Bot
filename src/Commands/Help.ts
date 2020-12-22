import bot from "@/Core/Bot"
import Command from "@core/Contracts/Command"

const command = Command({
  description: "Exibe a lista de comandos disponíveis.",
  help: ":x: Como usar: `!help`",
  run: async ({ send }) => {
    const commands = bot.getCommands().join(", ")

    await send(`Comandos disponíveis: ${commands}`)
  },
})
export default command
