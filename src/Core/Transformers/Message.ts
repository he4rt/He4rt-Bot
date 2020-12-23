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
  Role,
  GuildMember,
} from "discord.js"

import env from "@/env"
import Context from "@core/Contracts/Context"

const memberToUser = (member: GuildMember) => ({
  id: member.id,
  name: member.user.tag,
  avatar: member.user.avatar ?? "",
  avatarURL: member.user.avatarURL.bind(member.user),
  addRole: (role: Role | string) => member.roles.add(role),
  removeRole: (role: Role | string) => member.roles.remove(role),
  getRole: (roleName: string) =>
    member.roles.cache.find((role) => role.name.includes(roleName)),
  hasRole: (roleId: string) =>
    member.roles.cache.some((role) => role.id === roleId),
  sendDirectMessage: member.send.bind(member),
})

const isMention = (value: string) => /(^<@!\d+>$)/.test(value)

export const toContext = (message: Message): Context => {
  const [command, ...args] = message.content.slice(1).split(" ")

  const member = message.member as GuildMember

  const user = {
    name: message.author.tag,
    addRole: (role: Role | string) => member.roles.add(role),
    removeRole: (role: Role | string) => member.roles.remove(role),
    getRole: (value: string) =>
      member.roles.cache.find(
        (role) => role.name.includes(value) || role.id === value
      ),
    hasRole: (value: string) =>
      member.roles.cache.some(
        (role) => role.id === value || role.name === value
      ),
  }
  const argsWithoutMentions = args.filter((arg) => !isMention(arg))

  return {
    client: message.client,
    message,
    command,
    arg: argsWithoutMentions[0] || "",
    args: argsWithoutMentions,
    getMembers: () =>
      message.client.guilds
        .fetch(env.GUILD_ID)
        .then((guild) => guild.members.fetch())
        .then((members) => members.array()),
    send: message.channel.send.bind(message.channel),
    reply: message.reply.bind(message),
    user: memberToUser(member),
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
    getMentionedUsers: () => {
      const members = message.mentions.members?.array() ?? []

      return members.map(memberToUser)
    },
    hasMentionedUsers: () => {
      const { members } = message.mentions

      if (!members) {
        return false
      }

      return members.size > 0
    },
  }
}
