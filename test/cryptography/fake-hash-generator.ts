import { HashGenerator } from "../../src/domain/shipping/application/cryptography/hash-generator";

export class FakeHashGenerator implements HashGenerator {
  async hash(plain: string): Promise<string> {
    return plain + "-hashed";
  }
}
