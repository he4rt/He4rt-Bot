import Command from "@core/Contracts/Command"
import * as yup from "yup"
import { SlotSymbol, SlotMachine, EvaluatedLine } from "slot-machine"
import {
  /* getBalance, */ addValueToBalance,
  removeValue,
  getBalance,
} from "@/Services/UserService"
import { User } from "@core/Contracts/Context"
import { TextChannel, DMChannel, NewsChannel } from "discord.js"

const setup = (): SlotMachine => {
  const watermelon = new SlotSymbol("watermelon", {
    display: "🍉",
    points: 0.33,
    weight: 20,
  })

  const orange = new SlotSymbol("orange", {
    display: "🍊",
    points: 0.4,
    weight: 20,
  })

  const grape = new SlotSymbol("grape", {
    display: "🍇",
    points: 0.5,
    weight: 17,
  })

  const banana = new SlotSymbol("banana", {
    display: "🍌",
    points: 0.7,
    weight: 14,
  })

  const cherry = new SlotSymbol("cherry", {
    display: "🍒",
    points: 1,
    weight: 11,
  })

  const bell = new SlotSymbol("bell", {
    display: "🔔",
    points: 5,
    weight: 8,
  })

  const leaf = new SlotSymbol("leaf", {
    display: "🍀",
    points: 10,
    weight: 5,
  })

  const diamond = new SlotSymbol("diamond", {
    display: "💎",
    points: 50,
    weight: 2,
  })

  const seven = new SlotSymbol("seven", {
    display: ":seven:",
    points: 100,
    weight: 1,
  })

  const wild = new SlotSymbol("wildcard", {
    display: "🃏",
    points: 1,
    weight: 2,
    wildcard: true,
  })

  return new SlotMachine(3, [
    watermelon,
    orange,
    grape,
    banana,
    cherry,
    bell,
    leaf,
    diamond,
    seven,
    wild,
  ])
}

const isWin = (lines: EvaluatedLine[]): boolean => lines.some((x) => x.isWon)

const play = async (
  user: User,
  betValue: number,
  channel: TextChannel | DMChannel | NewsChannel
) => {
  const machine = setup()
  const game = machine.play()

  const gameResult = game.visualize().replace(/ /g, " : ")
  let answer = `\n**[  :slot_machine: l SLOTS ]**\n------------------\n${gameResult}\n------------------\n`

  if (isWin(game.lines)) {
    const multiplier = Number(
      game.totalPoints > 1 ? game.totalPoints.toFixed(2) : 1
    )

    answer += `\\💰**${
      user.name
    }, você ganhou x${multiplier} do valor, ${betValue *
      multiplier}** <:hcoin:548969665020297216>`

    await addValueToBalance(user.id, betValue * multiplier - betValue)
  } else {
    answer += `\\💰**${user.name}, você perdeu ${betValue}** <:hcoin:548969665020297216>`
    await removeValue(user.id, betValue)
  }

  await channel.send(answer)
}

const command = Command({
  description: "Máquina de caça-niquels.",
  help: ":x: Como usar: `!niquel <valor>`",
  validate: ({ arg }) =>
    yup
      .number()
      .required()
      .min(1)
      .max(500)
      .isValid(arg),
  run: async ({ user, message, arg }) => {
    const betValue = parseInt(arg, 10)
    const userBalance = await getBalance(user.id)

    if (betValue > Number(userBalance)) {
      return message.channel.send(
        `\\❗ Você não tem créditos suficientes para essa aposta, seu balanço é de ${userBalance}.`
      )
    }

    return play(user, betValue, message.channel)
  },
})
export default command
