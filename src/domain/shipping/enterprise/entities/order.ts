import { Entity } from "../../../core/entities/entity";
import { UniqueEntityId } from "../../../core/entities/unique-entity-id";
import { Optional } from "../../../core/types/optional";
import { DeliveryStage } from "../object-values/delivery-stage";

interface OrderProps {
  remitteId: UniqueEntityId;
  deliveryManId: UniqueEntityId;
  deliveryLocation: Location;
  deliveryStage: DeliveryStage;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class Order extends Entity<OrderProps> {
  get remitteId() {
    return this.props.remitteId;
  }

  set remitteId(remitteId: UniqueEntityId) {
    this.props.remitteId = remitteId;
    this.touch();
  }

  get deliveryManId() {
    return this.props.deliveryManId;
  }

  set deliveryManId(deliveryManId: UniqueEntityId) {
    this.props.deliveryManId = deliveryManId;
    this.touch();
  }

  get deliveryLocation() {
    return this.props.deliveryLocation;
  }

  set deliveryLocation(location: Location) {
    this.props.deliveryLocation = location;
    this.touch();
  }

  get deliveryStage() {
    return this.props.deliveryStage;
  }

  set deliveryStage(stage: DeliveryStage) {
    this.deliveryStage = stage;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  static create(
    props: Optional<OrderProps, "createdAt" | "deliveryStage">,
    id?: UniqueEntityId
  ) {
    return new Order(
      {
        remitteId: props.remitteId,
        deliveryManId: props.deliveryManId,
        deliveryLocation: props.deliveryLocation,
        deliveryStage: props.deliveryStage ?? new DeliveryStage(),
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt,
      },
      id
    );
  }
}
