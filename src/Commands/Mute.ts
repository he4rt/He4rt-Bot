import { RichEmbed } from "discord.js";

import Command from "@core/Contracts/Command";
import InvalidArgsException from "@core/Exceptions/InvalidArgs";
import env from "@/env";

const command = Command({
  description: "Muta um usuário",
  permissions: ["BAN_MEMBERS"],
  help: ":x: Como usar: `!mute <nick> <motivo>`",
  validate: async ({ args, hasMentionedUsers }) => {
    if (!hasMentionedUsers() || args.length <= 2) {
      throw new InvalidArgsException(command.help);
    }
  },
  run: async ({ args, send, user, getMentionedUsers, textChannels }) => {
    const [userToMute] = getMentionedUsers();

    await userToMute.addRole(env.MUTED_ROLE);

    const muteReason = args.join(" ").trim();

    const infoEmbed = new RichEmbed()
      .setTitle("``🚔`` » Punição")
      .addField("``👤`` **Usuário mutado:**", userToMute.user, true)
      .addField("``👮`` **Mutado por:**", user.name(), true)
      .addField("``📄`` **Tipo:**", "Mute", true)
      .addField("``📣`` **Motivo:**", muteReason, true)
      .setThumbnail(userToMute.user.avatarURL)
      .setColor("#8146DC")
      .setFooter(
        "2019 © He4rt Developers",
        "https://heartdevs.com/wp-content/uploads/2018/12/logo.png"
      )
      .setTimestamp();

    await send(
      new RichEmbed()
        .setTitle("``✅`` Usuário mutado com sucesso.")
        .addField("**Motivo: **", muteReason, true)
    );

    const punishmentChat = textChannels.get(env.PUNISHMENT_CHAT);
    if (!punishmentChat) {
      throw new Error(`${env.PUNISHMENT_CHAT} TextChanncel, doesn't exists`);
    }

    await Promise.all([
      userToMute.send("Você foi mutado, mais informações abaixo.", infoEmbed),
      punishmentChat.send(infoEmbed),
    ]);
  },
});
export default command;
