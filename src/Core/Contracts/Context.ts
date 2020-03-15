import {
  Message,
  StringResolvable,
  MessageOptions,
  RichEmbed,
  Attachment,
  GuildMember,
  Collection,
  Snowflake,
  TextChannel,
  VoiceChannel,
  PermissionOverwriteOptions,
  Role,
  RoleData,
  ChannelLogsQueryOptions,
  Client
} from "discord.js"

export default interface Context {
  client: Client
  message: Message
  send(
    content?: StringResolvable,
    options?: MessageOptions | RichEmbed | Attachment
  ): Promise<Message | Message[]>
  send(
    options?: MessageOptions | RichEmbed | Attachment
  ): Promise<Message | Message[]>
  reply(
    content?: StringResolvable,
    options?: MessageOptions
  ): Promise<Message | Message[]>
  reply(options?: MessageOptions): Promise<Message | Message[]>
  command: string
  arg: string
  args: string[]
  user: GuildMember & {
    name(): string
    role(name: string | RegExp): Role
    hasRole(name: string | RegExp): boolean
  }
  members: () => GuildMember[]
  textChannels: Collection<Snowflake, TextChannel>
  voiceChannels: Collection<Snowflake, VoiceChannel>
  createRole(data?: RoleData, reason?: string): Promise<Role>
  setRolePermissions(
    role: string,
    permissions: PermissionOverwriteOptions
  ): Promise<void>
  getChannelMessages(
    options?: ChannelLogsQueryOptions
  ): Promise<Collection<string, Message>>
  deleteChannelMessages(
    options?: ChannelLogsQueryOptions
  ): Promise<Collection<string, Message>>
  getMentionedUsers: () => GuildMember[]
  hasMentionedUsers: () => boolean
}
