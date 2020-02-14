import {
  Message,
  Client,
  Collection,
  VoiceChannel,
  TextChannel,
  PermissionOverwriteOptions,
  GuildChannel,
  RoleData,
  Role
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
      user: {
        ...message.member,
        name: (): string => message.author.tag,
        role: (name: string | RegExp): Role =>
          message.member.roles.find((r) => new RegExp(name).test(r.name)),
        hasRole: (name: string | RegExp): boolean =>
          !!message.member.roles.find((r) => new RegExp(name).test(r.name))
      } as any /* change this */,
      textChannels: client.channels as Collection<string, TextChannel>,
      voiceChannels: client.channels as Collection<string, VoiceChannel>,
      createRole: (data?: RoleData, reason?: string) =>
        message.guild.createRole(data, reason),
      setRolePermissions: (
        roleName: string,
        permissions: PermissionOverwriteOptions
      ) =>
        (message.channel as GuildChannel).overwritePermissions(
          message.guild.roles.find(({ name }) => name === roleName),
          permissions
        )
    }
  }
}
