import {
  Message,
  StringResolvable,
  MessageOptions,
  GuildMember,
  Collection,
  Snowflake,
  TextChannel,
  VoiceChannel,
  Role,
  RoleData,
  ChannelLogsQueryOptions,
  Client,
  PermissionOverwriteOption,
  MessageEmbed,
} from "discord.js"

type MessageContent = StringResolvable | MessageEmbed

export default interface Context {
  client: Client
  message: Message
  send(
    content: MessageContent,
    options?: MessageOptions
  ): Promise<Message | Message[]>
  reply(
    content: MessageContent,
    options?: MessageOptions
  ): Promise<Message | Message[]>
  command: string
  arg: string
  args: string[]
  user: GuildMember & {
    name(): string
    role(name: string | RegExp): Role
    hasRole(name: string | RegExp): boolean
  }
  getMembers: () => Promise<GuildMember[]>
  textChannels: Collection<Snowflake, TextChannel>
  voiceChannels: Collection<Snowflake, VoiceChannel>
  createRole(data?: RoleData, reason?: string): Promise<Role>
  setRolePermissions(
    role: string,
    permissions: PermissionOverwriteOption
  ): Promise<void>
  getChannelMessages(
    options?: ChannelLogsQueryOptions
  ): Promise<Collection<string, Message>>
  deleteChannelMessages(options?: ChannelLogsQueryOptions): Promise<void>
  getMentionedUsers: () => GuildMember[]
  hasMentionedUsers: () => boolean
}
