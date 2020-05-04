import { Message as DiscordMessage } from "discord.js";

import Ioc from "@core/IoC/Ioc";
import Event from "@core/Contracts/Event";
import Context from "@core/Contracts/Context";
import Command from "@core/Contracts/Command";
import RoleValidator from "@core/Validators/Role";
import MessageTransformer from "@core/Transformers/Message";
import env from "@/env";
import InvalidArgsException from "@/Core/Exceptions/InvalidArgs";

export default class Message extends Event {
  // eslint-disable-next-line class-methods-use-this
  public async run(message: DiscordMessage): Promise<void> {
    if (message.author.bot || !message.content.startsWith(env.COMMAND_PREFIX)) {
      return;
    }

    const messageTransformer = Ioc.use<MessageTransformer>(
      "Transformers/Message"
    );

    const context: Context = messageTransformer.item(message);

    try {
      const command = Ioc.use<Command>(context.command);

      await message.delete();

      const roleValidator = Ioc.use<RoleValidator>("RoleValidator");
      await roleValidator.validate(context, command);

      if (roleValidator.failed()) {
        await message.channel.send(roleValidator.messages());
        return;
      }

      await command.validate(context);
      await command.run(context);
    } catch (exception) {
      if (env.DEBUG) {
        console.error(exception);
      }

      if (exception instanceof InvalidArgsException) {
        await context.send(exception.message);
      } else {
        await context.send(
          "Algo não deu certo, tem certeza que esse comando existe?"
        );
      }
    }
  }
}
