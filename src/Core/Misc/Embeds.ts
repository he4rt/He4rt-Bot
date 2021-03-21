import { MessageEmbed } from "discord.js"

const FOOTER_ICON_URL = "https://i.imgur.com/14yqEKn.png"

class Embed extends MessageEmbed {
  private embed: MessageEmbed = new MessageEmbed()
    .setColor("#8146DC")
    .setFooter(
      `${new Date().getFullYear()} © He4rt Developers`,
      FOOTER_ICON_URL
    )
    .setTimestamp()

  addField = (name: string, value: unknown, inline = true): this => {
    this.embed.addField(name, value, inline)
    return this
  }

  static success = (): MessageEmbed =>
    new Embed()
      .setColor("#8146DC")
      .setFooter(
        `${new Date().getFullYear()} © He4rt Developers`,
        FOOTER_ICON_URL
      )
      .setTimestamp()

  static info = (): MessageEmbed =>
    new Embed()
      .setColor("#8146DC")
      .setFooter(
        `${new Date().getFullYear()} © He4rt Developers`,
        FOOTER_ICON_URL
      )
      .setTimestamp()
}

export const { info } = Embed

export const { success } = Embed
