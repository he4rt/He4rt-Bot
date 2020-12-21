import Command from "@core/Contracts/Command"

const command = Command({
  description: "Mostra a latência do bot",
  help: ":x: Como usar: `!ping`",
  run: ({ send, client }) =>
    send(`\`\`📡\`\` Latência da API: ${Math.round(client.ws.ping)}ms.`),
})
export default command
