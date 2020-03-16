import Command from "@core/Contracts/Command"
import InvalidArgsException from "@core/Exceptions/InvalidArgs"
import Ioc from "@core/IoC/Ioc"

const command = Command({
  description: "Mostra a descrição de um comando.",
  help: ":x: Como usar: `!descrever <comando>`",
  validate: async ({ arg }) => {
    if (!arg) {
      throw new InvalidArgsException(command.help)
    }
  },
  run: async ({ arg, send }) => {
    const command = Ioc.use<Command>(arg)

    await send(command.description)
  },
})
export default command
