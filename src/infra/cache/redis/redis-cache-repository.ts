import { redis } from ".";
import { CacheRepository } from "../cache-repository";

export class RedisCacheRepository implements CacheRepository {
  async set(key: string, value: string): Promise<void> {
    await redis.set(
      key,
      value,
      "EX",
      60 * 15 // 15 minutes
    );
  }

  async get(key: string): Promise<string | null> {
    const data = await redis.get(key);
    return data;
  }

  async delete(key: string): Promise<void> {
    await redis.del(key);
  }
}
