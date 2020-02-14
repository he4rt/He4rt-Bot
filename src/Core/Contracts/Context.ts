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
  RoleData
} from "discord.js"

export default interface Context {
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
  args: string[]
  user: GuildMember & {
    name(): string
    role(name: string | RegExp): Role
    hasRole(name: string | RegExp): boolean
  }
  textChannels: Collection<Snowflake, TextChannel>
  voiceChannels: Collection<Snowflake, VoiceChannel>
  createRole(data?: RoleData, reason?: string): Promise<Role>
  setRolePermissions(
    role: string,
    permissions: PermissionOverwriteOptions
  ): Promise<void>
}
