import Context from "./Context";
import Command from "./Command";

export default interface Validator {
  validate(ctx: Context, command: Command): void;
  failed(): boolean;
  messages(): string[];
}
