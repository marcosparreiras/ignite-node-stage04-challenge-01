export enum DeliveryStageEnum {
  PACKING,
  AVAILABE_TO_DELIVERY,
  ON_ROAD,
  DELIVERED,
}

export class DeliveryStage {
  private _stage: number;
  private _isReturned: boolean;

  get stage(): keyof typeof DeliveryStageEnum {
    return DeliveryStageEnum[this._stage] as keyof typeof DeliveryStageEnum;
  }

  get isReturned() {
    return this._isReturned;
  }

  constructor(stage?: DeliveryStageEnum, isReturned?: boolean) {
    this._stage = stage ?? DeliveryStageEnum.PACKING;
    this._isReturned = isReturned ?? false;
  }

  public nextStage(): DeliveryStage {
    let stg = this._stage;
    if (DeliveryStageEnum[stg + 1]) {
      stg++;
    }
    return new DeliveryStage(stg, this._isReturned);
  }

  public returnDelivery(): DeliveryStage {
    return new DeliveryStage(this._stage, true);
  }
}
