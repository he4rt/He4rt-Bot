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
  readonly validate: (context: Context) => Promise<boolean>
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
  validate: () => true,
  help: undefined,
  run: undefined,
} as const

const defaultObject = <T, U>(commandBase: U, options: T): T & U =>
  Object.fromEntries(
    Object.keys(commandBase).map((key) => [
      key,
      options[key] || commandBase[key],
    ])
  ) as T & U

// eslint-disable-next-line @typescript-eslint/no-redeclare
const Command = (options: CommandOptions): Command =>
  defaultObject(base, options)
export default Command
