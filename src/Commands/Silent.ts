import Command from "@core/Contracts/Command"
import Context from "@core/Contracts/Context"

export default class Silent extends Command {
  public get description() {
    return "Desativa/ativa mensagens da equipe"
  }

  public help(): string {
    return "Como usar: `!silent`"
  }

  public async run({ send, user }: Context): Promise<void> {
    const role = process.env.NOTIFY_ROLE!

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
  }
}
