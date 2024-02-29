import { Remittee } from "../../domain/shipping/enterprise/entities/remittee";

export function remitteePresenter(data: Remittee) {
  return {
    id: data.id.toString(),
    cpf: data.cpf,
    name: data.name,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}
