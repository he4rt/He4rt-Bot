import Command from "@core/Contracts/Command";
import InvalidArgsException from "@core/Exceptions/InvalidArgs";
import env from "@/env";

const command = Command({
  description: "Manda uma mensagem pelo bot para cada usuário do servidor.",
  roles: [env.ADMIN_ROLE],
  roleValidationMessages: {
    [env.ADMIN_ROLE]: "Apenas administradores podem usar esse comando.",
  },
  help: ":x: Como usar: `!sayall <message>`",
  validate: async ({ args }) => {
    if (args.length === 0) {
      throw new InvalidArgsException(command.help);
    }
  },
  run: async ({ args, send, members }) => {
    const message = args.join(" ");

    await send(
      "Enviando mensagem para todos os usuários...\n``❗`` Vai retornar algum erro."
    );

    await Promise.all(members().map((member) => member.send(message)));
  },
});
export default command;
