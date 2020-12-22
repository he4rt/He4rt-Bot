import { Message as DiscordMessage } from "discord.js"

import env from "@/env"
import EventHandler from "@/Core/Contracts/EventHandler"
import Context from "@core/Contracts/Context"
import roleValidator from "@core/Validators/Role"
import messageTransformer from "@core/Transformers/Message"
import bot from "@/Core/Bot"

const onMessage: EventHandler = {
  on: "message",
  handler: async (message: DiscordMessage): Promise<void> => {
    if (message.author.bot || !message.content.startsWith(env.COMMAND_PREFIX)) {
      return
    }

    const context: Context = messageTransformer(message)

    try {
      const command = bot.getCommand(context.command)

      await message.delete()

      if (!command) {
        await context.send(bot.getCommandSuggestion(context.command))
        return
      }

      await roleValidator.validate(context, command)

      if (roleValidator.failed()) {
        await message.channel.send(roleValidator.messages())
        return
      }

      if (!(await command.validate(context))) {
        await context.send(command.help)
        return
      }

      await command.run(context)
    } catch (exception) {
      if (env.DEBUG) {
        console.error(exception)
      }

      await context.send(
        "Algo não deu certo, tem certeza que esse comando existe?"
      )
    }
  },
}

export default onMessage
