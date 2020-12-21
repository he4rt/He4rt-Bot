export default class InvalidArgsException extends Error {
  public readonly __internal = true

  constructor(message = "") {
    super(message)
  }
}
