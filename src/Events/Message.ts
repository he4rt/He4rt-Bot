import { Message as DiscordMessage } from "discord.js"

import Ioc from "@core/IoC/Ioc"
import Event from "@core/Contracts/Event"
import Context from "@core/Contracts/Context"
import Command from "@core/Contracts/Command"
import RoleValidator from "@core/Validators/Role"
import MessageTransformer from "@core/Transformers/Message"

export default class Message extends Event {
  public async run(message: DiscordMessage): Promise<void> {
    if (
      message.author.bot ||
      !message.content.startsWith(process.env.COMMAND_PREFIX as string)
    ) {
      return
    }

    const messageTransformer = Ioc.use<MessageTransformer>(
      "Transformers/Message"
    )

    const context: Context = messageTransformer.item(message)

    try {
      const command = Ioc.use<Command>(context.command)

      await message.delete()

      const roleValidator = Ioc.use<RoleValidator>("RoleValidator")
      await roleValidator.validate(context, command)

      if (roleValidator.failed()) {
        await message.channel.send(roleValidator.messages())
        return
      }

      command.validate(context.args)
      await command.run(context)
    } catch (exception) {
      if (process.env.DEBUG) {
        console.error(exception)
      }

      await context.send(
        exception.__internal && exception.message
          ? exception.message
          : "Algo não deu certo, tem certeza que esse comando existe?"
      )
    }
  }
}
