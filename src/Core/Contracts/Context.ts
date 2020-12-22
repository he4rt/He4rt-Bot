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
  ImageURLOptions,
} from "discord.js"

type MessageContent = StringResolvable | MessageEmbed

type User = {
  id: Snowflake
  name: string
  avatar: string
  avatarURL: (
    options?: ImageURLOptions & { dynamic?: boolean }
  ) => string | null
  addRole: (role: Role | string) => Promise<GuildMember>
  removeRole: (role: Role | string) => Promise<GuildMember>
  getRole(role: string | RegExp): Role | undefined
  hasRole(role: string | RegExp): boolean
}

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
  user: User
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
  getMentionedUsers: () => User[]
  hasMentionedUsers: () => boolean
}
