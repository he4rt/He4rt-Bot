import Command from "@core/Contracts/Command"
import * as embed from "@/Core/Misc/Embeds"
import * as yup from "yup"
import { evaluate } from "mathjs"

const command = Command({
  description: "Mostra o resultado de uma expressão matemática",
  help: ":x: Como usar: `!calcular <expr>`",
  validate: ({ args }) =>
    yup
      .array()
      .min(3)
      .required()
      .isValid(args),
  run: async ({ args, send, user }) => {
    const expression = args.join(" ")

    const result = evaluate(expression)

    const answer = embed
      .info()
      .setTitle("``➗`` » !calcular")
      .addFields(
        { name: "**Cálculo:**", value: expression },
        { name: "**Resposta:**", value: result }
      )
      .setFooter(
        `Comando utilizado por: ${user.name}`,
        "https://i.imgur.com/14yqEKn.png"
      )

    return send(answer)
  },
})
export default command
