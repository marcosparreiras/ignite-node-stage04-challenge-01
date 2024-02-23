import { DomainEvent } from "../events/domain-event";
import { DomainEvents } from "../events/domain-events";
import { UniqueEntityId } from "./unique-entity-id";

export abstract class Entity<Props> {
  private _domainEvents: DomainEvent[] = [];
  private _id: UniqueEntityId;
  protected props: Props;

  get id() {
    return this._id;
  }

  get domainEvents() {
    return this._domainEvents;
  }

  protected constructor(props: Props, id?: UniqueEntityId) {
    this.props = props;
    this._id = id ?? new UniqueEntityId();
  }

  public equals(entity: Entity<any>) {
    return this._id.equals(entity.id);
  }

  protected addDomainEvent(domainEvent: DomainEvent): void {
    this._domainEvents.push(domainEvent);
    DomainEvents.markAggregateForDispatch(this);
  }

  public clearEvents() {
    this._domainEvents = [];
  }
}
