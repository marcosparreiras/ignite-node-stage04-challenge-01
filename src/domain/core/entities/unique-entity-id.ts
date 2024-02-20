import { randomUUID } from "node:crypto";

export class UniqueEntityId {
  private _value: string;

  public toString() {
    return this._value;
  }

  public isEqual(id: UniqueEntityId) {
    return this._value === id.toString();
  }

  constructor(value?: string) {
    this._value = value ?? randomUUID();
  }
}
