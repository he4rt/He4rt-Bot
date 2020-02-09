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
  VoiceChannel
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
  member: GuildMember
  textChannels: Collection<Snowflake, TextChannel>
  voiceChannels: Collection<Snowflake, VoiceChannel>
}
