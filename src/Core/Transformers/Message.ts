import {
  Message,
  Client,
  Collection,
  VoiceChannel,
  TextChannel,
  PermissionOverwriteOptions,
  GuildChannel,
  RoleData,
  ChannelLogsQueryOptions,
} from "discord.js";

import Context from "@core/Contracts/Context";
import Ioc from "@core/IoC/Ioc";
import env from "@/env";

export default class MessageTransformer {
  // eslint-disable-next-line class-methods-use-this
  public item(message: Message): Context {
    const [command, ...args] = message.content.slice(1).split(" ");

    const client = Ioc.use<Client>("Client");

    return {
      client,
      message,
      command,
      arg: args[0] || "",
      args,
      members: () => {
        const guild = client.guilds.get(env.GUILD_ID);
        if (!guild) {
          throw new Error(`guild not found ${env.GUILD_ID}`);
        }
        return guild.members.array();
      },
      send: message.channel.send.bind(message.channel),
      reply: message.reply.bind(message),
      user: Object.assign(message.member, {
        name: () => message.author.tag,
        role: (name: string | RegExp) =>
          message.member.roles.find((r) => new RegExp(name).test(r.name)),
        hasRole: (name: string | RegExp) =>
          message.member.roles.some((r) => new RegExp(name).test(r.name)),
      }),
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
        ),
      getChannelMessages: (options?: ChannelLogsQueryOptions) =>
        message.channel.fetchMessages(options),
      deleteChannelMessages: (options?: ChannelLogsQueryOptions) =>
        message.channel
          .fetchMessages(options)
          .then((messages) => message.channel.bulkDelete(messages)),
      getMentionedUsers: () => message.mentions.members.array(),
      hasMentionedUsers: () => Boolean(message.mentions.members.first()),
    };
  }
}
