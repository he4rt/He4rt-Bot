import { Message as DiscordMessage } from "discord.js"

import env from "@/env"
import EventHandler from "@/Core/Contracts/EventHandler"
import Context from "@core/Contracts/Context"
import * as roleValidator from "@core/Validators/Role"
import * as messageTransformer from "@core/Transformers/Message"
import bot from "@/Core/Bot"

const onMessage: EventHandler = {
  on: "message",
  handler: async (message: DiscordMessage): Promise<void> => {
    if (message.author.bot || !message.content.startsWith(env.COMMAND_PREFIX)) {
      return
    }

    const context: Context = messageTransformer.toContext(message)

    try {
      const command = bot.getCommand(context.command)

      await message.delete()

      if (!command) {
        await context.send(bot.getCommandSuggestion(context.command))
        return
      }

      const validationMessages = await roleValidator.validate(context, command)

      if (validationMessages.length > 0) {
        await message.channel.send(validationMessages)
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
