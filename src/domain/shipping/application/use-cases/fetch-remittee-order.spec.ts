import { makeOrder } from "../../../../../test/factories/make-order";
import { makeRemittee } from "../../../../../test/factories/make-remittee";
import { InMemoryOrderRepository } from "../../../../../test/repositories/in-memory-order-repository";
import { InMemoryRemitteeRepository } from "../../../../../test/repositories/in-memory-remittee-repository";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";
import { FetchRemitteeOrderUseCase } from "./fetch-remittee-order";

describe("FetchRemitteeOrderUseCase", () => {
  let inMemoryRemitteeRepository: InMemoryRemitteeRepository;
  let inMemoryOrderRepository: InMemoryOrderRepository;
  let sut: FetchRemitteeOrderUseCase;

  beforeEach(() => {
    inMemoryRemitteeRepository = new InMemoryRemitteeRepository();
    inMemoryOrderRepository = new InMemoryOrderRepository();
    sut = new FetchRemitteeOrderUseCase(
      inMemoryRemitteeRepository,
      inMemoryOrderRepository
    );
  });

  it("Should be able to fetch remittee orders", async () => {
    const remittee = makeRemittee();
    const otherRemittee = makeRemittee();
    inMemoryRemitteeRepository.items.push(remittee, otherRemittee);

    for (let count = 1; count <= 14; count++) {
      if (count <= 3) {
        inMemoryOrderRepository.items.push(
          makeOrder({ remitteeId: otherRemittee.id })
        );
      }
      inMemoryOrderRepository.items.push(
        makeOrder({ remitteeId: remittee.id })
      );
    }

    const result = await sut.execute({
      remitteeCpf: remittee.cpf,
      page: 1,
    });

    expect(result.orders).toHaveLength(14);
  });

  it("Should be able to paginate remittee orders", async () => {
    const remittee = makeRemittee();
    inMemoryRemitteeRepository.items.push(remittee);

    for (let count = 1; count <= 22; count++) {
      inMemoryOrderRepository.items.push(
        makeOrder({ remitteeId: remittee.id })
      );
    }

    const page01 = await sut.execute({
      remitteeCpf: remittee.cpf,
      page: 1,
    });

    const page02 = await sut.execute({
      remitteeCpf: remittee.cpf,
      page: 2,
    });

    expect(page01.orders).toHaveLength(20);
    expect(page02.orders).toHaveLength(2);
  });

  it("Should not be able to fetch unexistent remittee orders", async () => {
    await expect(() =>
      sut.execute({
        remitteeCpf: "",
        page: 1,
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
