import Command from "@core/Contracts/Command"
import env from "@/env"

const command = Command({
  description: "Receber notificações de trabalhos.",
  help: ":x: Como usar: `!jobs`",
  run: async ({ send, user }) => {
    if (!user.hasRole(env.JOBS_ROLE)) {
      await user.addRole(env.JOBS_ROLE)

      return send(
        `\`\`✅\`\` Você será **notificado** quando houver novas vagas!`
      )
    }

    await user.removeRole(env.JOBS_ROLE)

    return send(
      `\`\`❗\`\` Você não será **notificado** quando houver novas vagas!`
    )
  },
})
export default command
