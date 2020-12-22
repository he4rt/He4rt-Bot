import { Client } from "discord.js"
import { readdir } from "fs"
import { parse, join } from "path"
import { promisify } from "util"
import { map, prop, zip } from "ramda"
import MiniSearch from "minisearch"

import env from "@/env"
import EventHandler from "@/Core/Contracts/EventHandler"
import Command from "../Contracts/Command"

const miniSearch = new MiniSearch({
  fields: ["name"],
  storeFields: ["name"],
})

type CommandMap = { [key: string]: Command }

const commands: CommandMap = {}

type Bot = {
  commands: CommandMap
  client: Client
  getCommand: (command: keyof CommandMap) => Command
  getCommands: () => string[]
  getCommandSuggestion: (commandName: string) => string
  start: () => Promise<void>
}

const registerCommands = async () => {
  const path = join(__dirname, "..", "..", "Commands")

  const files = await promisify(readdir)(path)

  const names = files.map((file) => parse(file).name.toLowerCase())

  const commandHandlers = await Promise.all<{ default: Command }>(
    files.map((file) => import(`${path}/${file}`))
  ).then(map(prop("default")))

  zip(names, commandHandlers).forEach(([name, commandHandler]) => {
    commands[name] = commandHandler
  })
}

const registerEvents = async (client: Client) => {
  const path = join(__dirname, "..", "..", "Events")

  const files = await promisify(readdir)(path)

  const eventHandlers = await Promise.all<{ default: EventHandler }>(
    files.map((file) => import(`${path}/${file}`))
  ).then(map(prop("default")))

  eventHandlers.forEach(({ on, handler }) =>
    client.on(on.toLowerCase(), handler)
  )
}

const getCommands: Bot["getCommands"] = () => Object.keys(commands)

const getCommand: Bot["getCommand"] = (command) => commands[command]

const indexCommandsForTextSearch = () => {
  const documentsForTextSearch = getCommands().map((name) => ({
    id: name,
    name,
  }))

  miniSearch.addAll(documentsForTextSearch)
}

const getCommandSuggestion = (commandName: string) => {
  const results = miniSearch.autoSuggest(commandName, { fuzzy: 0.3 })

  const suggestion = results.length > 0 ? results[0].suggestion : null

  const answer = suggestion
    ? `Comando ${commandName} não encontrado, você quis dizer ${suggestion}?`
    : "Comando não encontrado"

  return answer
}

let client: Client = (null as unknown) as Client

const start = async (): Promise<void> => {
  client = new Client({ fetchAllMembers: true })

  await registerEvents(client)

  await registerCommands()

  indexCommandsForTextSearch()

  await client.login(env.AUTH_TOKEN)
}

export default {
  start,
  commands,
  getCommand,
  getCommands,
  getCommandSuggestion,
  client,
} as Bot
