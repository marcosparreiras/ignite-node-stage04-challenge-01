import { Optional } from "../../../core/types/optional";
import { Person, PersonProps } from "./Person";
import { UniqueEntityId } from "../../../core/entities/unique-entity-id";
import { Location } from "../object-values/location";

interface DeliveryManProps extends PersonProps {
  password: string;
  isAdmin: boolean;
  lastLocation: Location | null;
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

  get lastLocation(): Location | null {
    return this.props.lastLocation;
  }

  set lastLocation(lastLocation: Location) {
    this.props.lastLocation = lastLocation;
    this.touch();
  }

  static create(
    props: Optional<DeliveryManProps, "createdAt" | "isAdmin" | "lastLocation">,
    id?: UniqueEntityId
  ) {
    return new DeliveryMan(
      {
        cpf: props.cpf,
        name: props.name,
        password: props.password,
        isAdmin: props.isAdmin ?? false,
        lastLocation: props.lastLocation ?? null,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt,
      },
      id
    );
  }
}
