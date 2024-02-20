import { UniqueEntityId } from "./unique-entity-id";

export abstract class Entity<Props> {
  private _id: UniqueEntityId;
  protected props: Props;

  get id() {
    return this._id;
  }

  public isEqual(entity: Entity<any>) {
    return this._id.isEqual(entity.id);
  }

  protected constructor(props: Props, id?: UniqueEntityId) {
    this.props = props;
    this._id = id ?? new UniqueEntityId();
  }
}
