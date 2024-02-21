export class RemitteeAlreadyExistsError extends Error {
  constructor() {
    super("Remittee man already exists");
  }
}
