import Context from "@core/Context"

export default abstract class Command {
  public abstract async help(): Promise<string>

  public abstract async run(ctx: Context): Promise<void>
}
