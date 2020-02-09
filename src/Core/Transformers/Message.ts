import {
  Message,
  Client,
  Collection,
  VoiceChannel,
  TextChannel
} from "discord.js"

import Context from "@core/Contracts/Context"
import Ioc from "@core/IoC/Ioc"

export default class MessageTransformer {
  public item(message: Message): Context {
    const [command, ...args] = message.content.slice(1).split(" ")

    const client = Ioc.use<Client>("Client")

    return {
      command,
      args,
      message,
      send: message.channel.send.bind(message.channel),
      reply: message.reply.bind(message),
      member: message.member,
      textChannels: client.channels as Collection<string, TextChannel>,
      voiceChannels: client.channels as Collection<string, VoiceChannel>
    }
  }
}
