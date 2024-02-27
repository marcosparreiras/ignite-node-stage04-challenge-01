import { FakeHashCompare } from "../../../../test/cryptography/fake-hash-compare";
import { HashGenerator } from "../../../domain/shipping/application/cryptography/hash-generator";
import { hash, compare } from "bcryptjs";

export class HashService implements FakeHashCompare, HashGenerator {
  async hash(plain: string): Promise<string> {
    const hashed = await hash(plain, 8);
    return hashed;
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    const success = await compare(plain, hash);
    return success;
  }
}
