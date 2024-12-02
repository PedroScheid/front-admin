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

interface User {
  id: string;
  email: string;
}

interface FunctionDetails {
  id: string;
  name: string;
  description: string;
  percent_completed: string;
  status: string;
}

interface AuditDetails {
  id: string;
  email: string;
}

export interface UsuarioProps {
  id: string;
  user: User;
  function: FunctionDetails;
  permission_type: string;
  is_obsolete: boolean;
  created_by: AuditDetails;
  date_created: Date;
  modified_by: AuditDetails;
  last_modified_date: Date;
}

export interface UsuarioCompleto {
  id: string;
  name: string;
  profile_picture: string;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  date_created: Date;
  last_login: Date;
  email: string;
  serial_number: string;
  about_me: string;
}

export interface UserFunction {
  user: string;
  function: string;
  permission_type: string;
  is_obsolete: boolean;
}
