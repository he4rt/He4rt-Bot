import Ioc from "@core/IoC/Ioc";
import Command from "@core/Contracts/Command";

const command = Command({
  description: "Exibe a lista de comandos disponíveis.",
  help: ":x: Como usar: `!help`",
  run: async ({ send }) => {
    const commandList = Ioc.use<string[]>("Commands");

    await send(`Comandos disponíveis: ${commandList}`);
  },
});
export default command;
