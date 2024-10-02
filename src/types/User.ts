export enum UserRole {
  NORMAL,
  ADMIN,
}

export enum Gender {
  MASCULINO,
  FEMININO,
}

export interface Usuario {
  id: number;
  nome: string;
  senha: string;
  email: string;
  tipo_usuario: UserRole;
  genero: number;
  data_criacao: Date;
  data_exclusao: Date;
}
