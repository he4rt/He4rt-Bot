import env from "@/env"
import Command from "@core/Contracts/Command"

const command = Command({
  description: "Desativa/ativa mensagens da equipe",
  help: "Como usar: `!silent`",
  run: async ({ send, user }) => {
    const role = env.NOTIFY_ROLE

    const hasRole = user.hasRole(role)

    if (hasRole) {
      await user.removeRole(role)
    } else {
      await user.addRole(role)
    }

    await send(
      hasRole
        ? "Você receberá mensagens da equipe"
        : "Você não receberá mensagens da equipe"
    )
  },
})
export default command
