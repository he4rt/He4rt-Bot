import Command from "@core/Contracts/Command"

const command = Command({
  description: "Mostra como formatar o código no chat.",
  help: ":x: Como usar: `!codigo`",
  run: async ({ send }) => {
    const answer =
      "Formate seu código:\n\\`\\`\\`js\n    CODIGO AQUI\n\\`\\`\\`\nTroque 'js' por sua lang \n```js\n const foo = 10\n```"

    await send(answer)
  },
})
export default command
