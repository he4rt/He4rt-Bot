import Context from "@core/Contracts/Context"

export default abstract class Command {
  public get description() {
    return "Um comando que pode ser usado para interagir com o bot."
  }

  public get roles(): string[] {
    return []
  }

  public get roleValidationMessages() {
    return {}
  }

  public get validateAllRoles(): boolean {
    return false
  }

  public get permissions(): string[] {
    return []
  }

  public get permissionValidationMessages() {
    return {}
  }

  public get validateAllPermissions(): boolean {
    return false
  }

  public abstract help(): string

  public abstract async run(ctx: Context): Promise<void>
}
