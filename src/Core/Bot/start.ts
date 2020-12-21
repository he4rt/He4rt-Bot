import { Client } from "discord.js"
import { readdir } from "fs"
import { parse, join } from "path"
import { promisify } from "util"

import env from "@/env"
import Ioc from "@core/IoC/Ioc"
import MessageTransformer from "@core/Transformers/Message"
import RoleValidator from "@core/Validators/Role"

const registerCommands = async (client: Client) => {
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

const registerEvents = async (client: Client) => {
  const path = join(__dirname, "..", "..", "Events")

  const files = await promisify(readdir)(path)

  const events = await Promise.all(
    files.map((file) => import(`${path}/${file}`))
  )

  for (const { default: Event } of events) {
    client.on(Event.name.toLowerCase(), new Event().run)
  }
}

const registerUtilities = (client: Client) => {
  Ioc.singleton("Transformers/Message", MessageTransformer)
  Ioc.singleton("RoleValidator", RoleValidator)
  Ioc.singleton("Client", client)
}

export const start = async () => {
  const client = new Client({ fetchAllMembers: true })

  await registerEvents(client)

  await registerCommands(client)

  registerUtilities(client)

  await client.login(env.AUTH_TOKEN)
}
