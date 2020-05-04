import { Message } from "discord.js";

export default abstract class Event {
  public abstract async run(message: Message): Promise<void>;
}
