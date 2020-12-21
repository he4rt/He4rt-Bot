import {
  Message,
  Client,
  Collection,
  VoiceChannel,
  TextChannel,
  GuildChannel,
  RoleData,
  Role,
  ChannelLogsQueryOptions,
  PermissionOverwriteOption,
} from "discord.js"

import env from "@/env"
import Context from "@core/Contracts/Context"
import Ioc from "@core/IoC/Ioc"

export default class MessageTransformer {
  public item(message: Message): Context {
    const [command, ...args] = message.content.slice(1).split(" ")

    const client = Ioc.use<Client>("Client")

    return {
      client,
      message,
      command,
      arg: args[0] || "",
      args,
      getMembers: () =>
        client.guilds
          .fetch(env.GUILD_ID)
          .then((guild) => guild.members.fetch())
          .then((members) => members.array()),
      send: message.channel.send.bind(message.channel),
      reply: message.reply.bind(message),
      user: {
        ...message.member,
        name: (): string => message.author.tag,
        role: (name: string | RegExp): Role =>
          message.member?.roles.cache
            .array()
            .find((r) => new RegExp(name).test(r.name))!,
        hasRole: (name: string | RegExp): boolean =>
          message
            .member!.roles.cache.array()
            .some((r) => new RegExp(name).test(r.name)),
      } as any /* change this */,
      textChannels: client.channels.cache as Collection<string, TextChannel>,
      voiceChannels: client.channels.cache as Collection<string, VoiceChannel>,
      createRole: (data?: RoleData, reason?: string) =>
        message.guild!.roles.create({ data, reason }),
      setRolePermissions: async (
        roleName: string,
        permissions: PermissionOverwriteOption
      ) => {
        const role = message.guild!.roles.cache.find(
          ({ name }) => name === roleName
        )
        if (!role) {
          return // handle me
        }

        const guildChannel = message.channel as GuildChannel

        await guildChannel.updateOverwrite(role, permissions)
      },
      getChannelMessages: (options?: ChannelLogsQueryOptions) =>
        message.channel.messages.fetch(options),
      deleteChannelMessages: async (options?: ChannelLogsQueryOptions) => {
        const messages = await message.channel.messages.fetch(options)

        const textChannel = message.channel as TextChannel

        await textChannel.bulkDelete(messages)
      },
      getMentionedUsers: () => message.mentions.members!.array(),
      hasMentionedUsers: () => message.mentions.members!.size > 0,
    }
  }
}
