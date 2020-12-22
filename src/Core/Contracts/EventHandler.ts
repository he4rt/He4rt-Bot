import { Message } from "discord.js"

type EventHandler = {
  on: string
  handler: (message: Message) => Promise<unknown> | unknown
}

export default EventHandler
