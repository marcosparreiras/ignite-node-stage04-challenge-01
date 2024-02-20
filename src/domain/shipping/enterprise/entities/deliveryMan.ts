import { Optional } from "../../../core/types/optional";
import { Person, PersonProps } from "./Person";
import { UniqueEntityId } from "../../../core/entities/unique-entity-id";

export interface DeliveryManProps extends PersonProps {
  password: string;
  isAdmin: boolean;
}

export class DeliveryMan extends Person<DeliveryManProps> {
  get password() {
    return this.props.password;
  }

  set password(password: string) {
    this.props.password = password;
    this.touch();
  }

  get isAdmin() {
    return this.props.isAdmin;
  }

  set isAdmin(isAdmin: boolean) {
    this.props.isAdmin = isAdmin;
    this.touch();
  }

  static create(
    props: Optional<DeliveryManProps, "createdAt" | "isAdmin">,
    id?: UniqueEntityId
  ) {
    return new DeliveryMan(
      {
        cpf: props.cpf,
        name: props.name,
        password: props.password,
        isAdmin: props.isAdmin ?? false,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt,
      },
      id
    );
  }
}
