export interface Curso {
  id: string;
  name: string;
  course: string;
  sequence_in_course: number;
  class_file_type: "image" | "video" | "document" | string;
  class_file: string;
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
  date_created: Date;
  is_active: boolean;
}
