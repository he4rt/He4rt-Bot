import Command from "@core/Contracts/Command";

const command = Command({
  description: "Mostra a latência do bot",
  help: ":x: Como usar: `!ping`",
  run: async ({ send, client }) => {
    await send(`\`\`📡\`\` Latência da API: ${Math.round(client.ping)}ms.`);
  },
});
export default command;
