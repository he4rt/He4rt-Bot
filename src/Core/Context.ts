/* eslint-disable @typescript-eslint/member-delimiter-style */
import { Message } from "discord.js"

export default interface Context {
  message: Message
  // tirar as infos importantes da mensagem
  // e adicionar aqui como funções por comodidade
}
