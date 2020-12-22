import { MessageEmbed } from "discord.js"

class Embed extends MessageEmbed {
  private embed: MessageEmbed = new MessageEmbed()
    .setColor("#8146DC")
    .setFooter(
      `${new Date().getFullYear()} © He4rt Developers`,
      "https://heartdevs.com/wp-content/uploads/2018/12/logo.png"
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
        "https://heartdevs.com/wp-content/uploads/2018/12/logo.png"
      )
      .setTimestamp()

  static info = (): MessageEmbed =>
    new Embed()
      .setColor("#8146DC")
      .setFooter(
        `${new Date().getFullYear()} © He4rt Developers`,
        "https://heartdevs.com/wp-content/uploads/2018/12/logo.png"
      )
      .setTimestamp()
}

export const { info } = Embed

export const { success } = Embed
