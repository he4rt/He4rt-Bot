export default class InvalidArgsException extends Error {
  public readonly __internal: boolean = true;

  constructor(message = "") {
    super(message);
  }
}
