export interface Usuario {
  id: number;
  nome: string;
  senha: string;
  email: string;
}

export interface LoginProps {
  email: string;
  password: string;
}

export interface RegisterUser {
  email: string;
  password1: string;
  password2: string;
}
