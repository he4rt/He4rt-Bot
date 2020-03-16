import { Client } from "discord.js"
import { readdir } from "fs"
import { parse, join } from "path"
import { promisify } from "util"

import env from "@/env"
import Ioc from "@core/IoC/Ioc"
import MessageTransformer from "@core/Transformers/Message"
import RoleValidator from "@core/Validators/Role"

export default class Ignitor {
  private client: Client

  private async registerEvents(): Promise<void> {
    const path = join(__dirname, "..", "..", "Events")

    const files = await promisify(readdir)(path)

    const events = await Promise.all(
      files.map((file) => import(`${path}/${file}`))
    )

    for (const { default: Event } of events) {
      this.client.on(Event.name.toLowerCase(), new Event().run)
    }
  }

  private async registerCommands(): Promise<void> {
    const path = join(__dirname, "..", "..", "Commands")

    const files = await promisify(readdir)(path)

    const names = files.map((file) => parse(file).name)
    const commands = (
      await Promise.all(files.map((file) => import(`${path}/${file}`)))
    ).map((file) => file.default)

    Ioc.singleton("Commands", names)

    commands.forEach((command, i) => {
      const name = names[i]
      Ioc.singleton(name.toLowerCase(), command)
    })
  }

  private async registerUtilities(): Promise<void> {
    Ioc.singleton("Transformers/Message", MessageTransformer)
    Ioc.singleton("RoleValidator", RoleValidator)
    Ioc.singleton("Client", this.client)
  }

  public async boostrap(): Promise<void> {
    this.client = new Client({ fetchAllMembers: true })

    await Promise.all([
      this.registerEvents(),
      this.registerCommands(),
      this.registerUtilities(),
    ])

    await this.client.login(env.AUTH_TOKEN)
    console.log("Bot on")
  }
}
