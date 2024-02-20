import { DeliveryStage, DeliveryStageEnum } from "./delivery-stage";

describe("DeliverySatge [Value-Object]", () => {
  it("Should be able to mark as returned", async () => {
    const deliveryStage = new DeliveryStage();
    expect(deliveryStage.isReturned).toEqual(false);
    const newDeliveryStage = deliveryStage.returnDelivery();
    expect(newDeliveryStage.isReturned).toEqual(true);
  });

  it("Should be able to get next delivery stage", () => {
    const deliveryStage = new DeliveryStage();
    expect(deliveryStage.stage).toEqual(DeliveryStageEnum[0]);
    const newDeliveryStage = deliveryStage.nextStage();
    expect(newDeliveryStage.stage).toEqual(DeliveryStageEnum[1]);
  });
});
