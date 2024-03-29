import { UniqueEntityId } from "../../../core/entities/unique-entity-id";
import { Optional } from "../../../core/types/optional";
import { Person, PersonProps } from "./Person";

export interface RemitteProps extends PersonProps {}

export class Remittee extends Person<RemitteProps> {
  static create(
    props: Optional<RemitteProps, "createdAt">,
    id?: UniqueEntityId
  ) {
    return new Remittee(
      {
        cpf: props.cpf,
        name: props.name,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt,
      },
      id
    );
  }
}
