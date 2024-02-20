import { Entity } from "../../../core/entities/entity";

export interface PersonProps {
  cpf: string;
  name: string;
  createdAt: Date;
  updatedAt?: Date | null;
}

export abstract class Person<Props extends PersonProps> extends Entity<Props> {
  get cpf() {
    return this.props.cpf;
  }

  set cpf(cpf: string) {
    this.props.cpf = cpf;
    this.touch();
  }

  get name() {
    return this.props.name;
  }

  set name(name: string) {
    this.props.name = name;
    this.touch();
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  protected touch() {
    this.props.updatedAt = new Date();
  }
}
