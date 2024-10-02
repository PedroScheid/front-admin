import { DropdownOptions, Gender, UserRole } from "../types";

export const userRoleOptions: DropdownOptions[] = [
  {
    value: UserRole.NORMAL,
    text: "Normal",
  },
  {
    value: UserRole.ADMIN,
    text: "Administrador",
  },
];

export const genderOptions: DropdownOptions[] = [
  { text: "Masculino", value: Gender.MASCULINO },
  { text: "Feminino", value: Gender.FEMININO },
];
