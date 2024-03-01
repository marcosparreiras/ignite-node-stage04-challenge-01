import { makePrismaDeliveryMan } from "../../../../../test/factories/prisma/make-prisma-delivery-man";
import { makePrismaOrder } from "../../../../../test/factories/prisma/make-prisma-order";
import { makePrismaRemittee } from "../../../../../test/factories/prisma/make-prisma-remittee";
import { CacheRepository } from "../../../cache/cache-repository";
import { RedisCacheRepository } from "../../../cache/redis/redis-cache-repository";
import { PrismaOrderRepository } from "./prisma-order-repository";

describe("PrismaOrderRepository [E2E]", () => {
  let cacheRepository: CacheRepository;
  let prismaOrderRepository: PrismaOrderRepository;

  beforeAll(() => {
    cacheRepository = new RedisCacheRepository();
    prismaOrderRepository = new PrismaOrderRepository(cacheRepository);
  });

  it("Should cache order by id on search", async () => {
    const [deliveryMan, remittee] = await Promise.all([
      makePrismaDeliveryMan(),
      makePrismaRemittee(),
    ]);

    const order = await makePrismaOrder({
      deliveryManId: deliveryMan.id,
      remitteeId: remittee.id,
    });
    const orderOnRepository = await prismaOrderRepository.findById(
      order.id.toString()
    );
    const orderOnCache = await cacheRepository.get(
      `order:${order.id.toString()}`
    );
    expect(orderOnCache).toEqual(JSON.stringify(orderOnRepository));
  });

  it("Should delete cache order on order save (update)", async () => {
    const [deliveryMan, remittee] = await Promise.all([
      makePrismaDeliveryMan(),
      makePrismaRemittee(),
    ]);

    const order = await makePrismaOrder({
      deliveryManId: deliveryMan.id,
      remitteeId: remittee.id,
    });
    await prismaOrderRepository.findById(order.id.toString());
    await prismaOrderRepository.save(order);
    const orderOnCache = await cacheRepository.get(
      `order:${order.id.toString()}`
    );
    expect(orderOnCache).toBeNull();
  });

  it("Should delete cache order on order delete", async () => {
    const [deliveryMan, remittee] = await Promise.all([
      makePrismaDeliveryMan(),
      makePrismaRemittee(),
    ]);

    const order = await makePrismaOrder({
      deliveryManId: deliveryMan.id,
      remitteeId: remittee.id,
    });
    await prismaOrderRepository.findById(order.id.toString());
    await prismaOrderRepository.delete(order);
    const orderOnCache = await cacheRepository.get(
      `order:${order.id.toString()}`
    );
    expect(orderOnCache).toBeNull();
  });
});
