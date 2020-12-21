import Context from "./Context"

interface Command {
  readonly description: string
  readonly roles: string[]
  readonly roleValidationMessages: { [key: string]: string }
  readonly validateAllRoles: boolean
  readonly permissions: string[]
  readonly permissionValidationMessages: { [key: string]: string }
  readonly validateAllPermissions: boolean
  readonly help: string
  readonly validate: (context: Context) => Promise<void | never>
  readonly run: (context: Context) => Promise<unknown>
}
type CommandOptions = Partial<Command> & {
  help: Command["help"]
  run: Command["run"]
}
const base = {
  description: "Um comando que pode ser usado para interagir com o bot",
  roles: [],
  roleValidationMessages: [],
  validateAllRoles: true, // TODO: should be true or false?
  permissions: [],
  permissionValidationMessages: {},
  validateAllPermissions: true, // TODO: should be true or false?
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  validate: () => {},
  help: undefined,
  run: undefined,
} as const

const defaultObject = <T, U>(base: U, options: T): T & U =>
  Object.fromEntries(
    Object.keys(base).map((key) => [key, options[key] || base[key]])
  ) as T & U

const Command = (options: CommandOptions): Command =>
  defaultObject(base, options)
export default Command
