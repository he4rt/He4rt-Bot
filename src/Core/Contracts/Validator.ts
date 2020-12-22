import Context from "./Context"
import Command from "./Command"

type Validator = (
  ctx: Context,
  command: Command
) => Promise<string[]> | string[]

export default Validator
