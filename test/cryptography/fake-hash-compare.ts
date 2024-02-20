import { HashCompare } from "../../src/domain/shipping/cryptography/hash-compare";

export class FakeHashCompare implements HashCompare {
  async compare(plain: string, hash: string): Promise<boolean> {
    return plain + "-hashed" === hash;
  }
}
