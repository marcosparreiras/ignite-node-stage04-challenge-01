import { makeDeliveryMan } from "../../../../../test/factories/make-delivery-man";
import { makeOrder } from "../../../../../test/factories/make-order";
import { InMemoryDeliveryManRepository } from "../../../../../test/repositories/in-memory-delivery-man-repository";
import { InMemoryOrderRepository } from "../../../../../test/repositories/in-memory-order-repository";
import { FakeUploader } from "../../../../../test/storage/fake-uploader";
import { InvalidOrderDeliveryConfirmationPhotoTypeError } from "../errors/invalid-order-delivery-confirmation-photo-type-error";
import { NotAllowedError } from "../errors/not-allowed-error";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";
import { UploadOrderDeliveryConfirmationPhotoUseCase } from "./upload-order-delivery-confirmation-photo";

describe("UploadOrderDeliveryConfirmationPhotoUseCase [Use-Case]", () => {
  let inMemoryDeliveryManRespository: InMemoryDeliveryManRepository;
  let inMemoryOrderRepository: InMemoryOrderRepository;
  let fakeUploader: FakeUploader;
  let sut: UploadOrderDeliveryConfirmationPhotoUseCase;

  beforeEach(() => {
    inMemoryDeliveryManRespository = new InMemoryDeliveryManRepository();
    inMemoryOrderRepository = new InMemoryOrderRepository();
    fakeUploader = new FakeUploader();
    sut = new UploadOrderDeliveryConfirmationPhotoUseCase(
      inMemoryDeliveryManRespository,
      inMemoryOrderRepository,
      fakeUploader
    );
  });

  it("Should be able to upload a photo and update order delivery confirmation photo url", async () => {
    const deliveryMan = makeDeliveryMan();
    const order = makeOrder({ deliveryManId: deliveryMan.id });

    inMemoryDeliveryManRespository.items.push(deliveryMan);
    inMemoryOrderRepository.items.push(order);

    const result = await sut.execute({
      deliveryManId: deliveryMan.id.toString(),
      orderId: order.id.toString(),
      fileName: "fake-file",
      fileType: "image/png",
      body: Buffer.from(""),
    });

    expect(result.url).toBeTruthy();
    expect(fakeUploader.items).toHaveLength(1);
    expect(
      inMemoryOrderRepository.items[0].deliveryConfirmationPhotoUrl
    ).toEqual(result.url);
  });

  it("Should not be able to upload a photo with invalid type", async () => {
    const deliveryMan = makeDeliveryMan();
    const order = makeOrder({ deliveryManId: deliveryMan.id });

    inMemoryDeliveryManRespository.items.push(deliveryMan);
    inMemoryOrderRepository.items.push(order);

    await expect(() =>
      sut.execute({
        deliveryManId: deliveryMan.id.toString(),
        orderId: order.id.toString(),
        fileName: "fake-file",
        fileType: "audio/mp3",
        body: Buffer.from(""),
      })
    ).rejects.toBeInstanceOf(InvalidOrderDeliveryConfirmationPhotoTypeError);
  });

  it("Should be able to upload a photo for any order with admin", async () => {
    const admin = makeDeliveryMan({ isAdmin: true });
    const deliveryMan = makeDeliveryMan();
    const order = makeOrder({ deliveryManId: deliveryMan.id });

    inMemoryDeliveryManRespository.items.push(admin, deliveryMan);
    inMemoryOrderRepository.items.push(order);

    const result = await sut.execute({
      deliveryManId: admin.id.toString(),
      orderId: order.id.toString(),
      fileName: "fake-file",
      fileType: "image/png",
      body: Buffer.from(""),
    });

    expect(result.url).toBeTruthy();
  });

  it("Should not be able to upload a photo for another delivery-man order", async () => {
    const deliveryMan = makeDeliveryMan();
    const otherDeliveryMan = makeDeliveryMan();
    const order = makeOrder({ deliveryManId: otherDeliveryMan.id });

    inMemoryDeliveryManRespository.items.push(deliveryMan, otherDeliveryMan);
    inMemoryOrderRepository.items.push(order);

    await expect(() =>
      sut.execute({
        deliveryManId: deliveryMan.id.toString(),
        orderId: order.id.toString(),
        fileName: "fake-file",
        fileType: "image/png",
        body: Buffer.from(""),
      })
    ).rejects.toBeInstanceOf(NotAllowedError);
  });

  it("Should not be able to upload a photo for an unexistent order", async () => {
    const deliveryMan = makeDeliveryMan();

    inMemoryDeliveryManRespository.items.push(deliveryMan);

    await expect(() =>
      sut.execute({
        deliveryManId: deliveryMan.id.toString(),
        orderId: "",
        fileName: "fake-file",
        fileType: "image/png",
        body: Buffer.from(""),
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
