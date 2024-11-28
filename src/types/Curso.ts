export interface Curso {
  id: string;
  name: string;
  description: string;
  expiration_time_in_days: number;
  required_for_function: boolean;
  is_active: boolean;
  date_created: Date;
  last_modified_date: Date;
  created_by: string;
  modified_by: string;
}

export interface Aula {
  id: string;
  name: string;
  description: string;
  course: string;
  sequence_in_course: number;
  class_file_type: "image" | "video" | "document" | string;
  class_file: string;
  is_active: boolean;
}

export interface Setor {
  id: string;
  name: string;
  description: string;
}

export interface SubSetor {
  id: string;
  name: string;
  description: string;
  sector: string;
  date_created: Date;
  is_active: boolean;
}

export interface Funcao {
  id: string;
  name: string;
  description: string;
  subsector: string;
  date_created: Date;
  is_active: boolean;
}
