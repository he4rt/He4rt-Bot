import { inspect } from "util"
import {
  Message,
  Collection,
  VoiceChannel,
  TextChannel,
  GuildChannel,
  RoleData,
  ChannelLogsQueryOptions,
  PermissionOverwriteOption,
} from "discord.js"

import env from "@/env"
import Context from "@core/Contracts/Context"

const messageTransformer = (message: Message): Context => {
  const [command, ...args] = message.content.slice(1).split(" ")

  return {
    client: message.client,
    message,
    command,
    arg: args[0] || "",
    args,
    getMembers: () =>
      message.client.guilds
        .fetch(env.GUILD_ID)
        .then((guild) => guild.members.fetch())
        .then((members) => members.array()),
    send: message.channel.send.bind(message.channel),
    reply: message.reply.bind(message),
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    user: {
      ...message.member,
      name: (): string => message.author.tag,
      role: (name: string | RegExp) =>
        message.member?.roles.cache
          .array()
          .find((r) => new RegExp(name).test(r.name)),
      hasRole: (name: string | RegExp) => {
        const { member } = message

        if (!member) {
          return false
        }

        return member.roles.cache
          .array()
          .some((r) => new RegExp(name).test(r.name))
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any /* change this */,
    textChannels: message.client.channels.cache as Collection<
      string,
      TextChannel
    >,
    voiceChannels: message.client.channels.cache as Collection<
      string,
      VoiceChannel
    >,
    createRole: (data?: RoleData, reason?: string) => {
      const { guild } = message
      if (!guild) {
        throw new Error(`Guild not found when creating role: ${inspect(data)}`)
      }

      return guild.roles.create({ data, reason })
    },
    setRolePermissions: async (
      roleName: string,
      permissions: PermissionOverwriteOption
    ) => {
      const { guild } = message
      if (!guild) {
        throw new Error(
          `Guild not found when setting role ${roleName} permissions: ${inspect(
            permissions
          )}`
        )
      }

      const role = guild.roles.cache.find(({ name }) => name === roleName)
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
    getMentionedUsers: () => message.mentions.members?.array() ?? [],
    hasMentionedUsers: () => {
      const { members } = message.mentions

      if (!members) {
        return false
      }

      return members.size > 0
    },
  }
}

export default messageTransformer
