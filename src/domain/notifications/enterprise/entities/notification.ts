import { Entity } from "../../../core/entities/entity";
import { UniqueEntityId } from "../../../core/entities/unique-entity-id";
import { Optional } from "../../../core/types/optional";

export interface NotificationProps {
  recipientId: UniqueEntityId;
  title: string;
  content: string;
  readAt?: Date | null;
  createdAt: Date;
}

export class Notification extends Entity<NotificationProps> {
  get recipientId() {
    return this.props.recipientId;
  }

  get title() {
    return this.props.title;
  }

  get content() {
    return this.props.content;
  }

  get readAt(): Date | undefined | null {
    return this.props.readAt;
  }

  set readAt(value: Date) {
    this.props.readAt = value;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  static create(
    props: Optional<NotificationProps, "createdAt">,
    id?: UniqueEntityId
  ) {
    return new Notification(
      {
        recipientId: props.recipientId,
        title: props.title,
        content: props.content,
        readAt: props.readAt,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    );
  }
}
