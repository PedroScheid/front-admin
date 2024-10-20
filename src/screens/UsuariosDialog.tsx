import "../App.css";
import "primereact/resources/themes/bootstrap4-dark-blue/theme.css";
import { Button, Dropdown, Input } from "../components";
import { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { toast } from "react-toastify";
import { Gender, UserRole, Usuario } from "../types";
import { genderOptions, userRoleOptions } from "../utils";

interface UsuariosDialogProps {
  visible: boolean;
  closeDialog: () => void;
  update: () => Promise<void>;
  itemToEdit?: Usuario;
}

const UsuariosDialog = ({
  visible,
  closeDialog,
  update,
  itemToEdit,
}: UsuariosDialogProps) => {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [userRole, setUserRole] = useState(UserRole.NORMAL);
  const [gender, setGender] = useState(Gender.MASCULINO);

  useEffect(() => {
    if (itemToEdit) {
      setUser(itemToEdit.nome);
      setPassword(itemToEdit.senha);
      setEmail(itemToEdit.email);
      setUserRole(itemToEdit.tipo_usuario);
      setGender(itemToEdit.genero);
    } else {
      setUser("");
      setPassword("");
      setPassword("");
    }
  }, [itemToEdit]);

  const onChangeUser = (value: string) => {
    setUser(value);
  };

  const onChangePassword = (value: string) => {
    setPassword(value);
  };

  const onChangeEmail = (value: string) => {
    setEmail(value);
  };

  const onChangeUserRole = (value: UserRole) => {
    setUserRole(value);
  };

  const onChangeGender = (value: Gender) => {
    setGender(value);
  };

  const handleSave = async () => {
    if (!user) {
      toast.error("Por favor, preencha o nome.");
      return;
    }

    if (!password) {
      toast.error("Por favor, preencha a senha.");
      return;
    }

    if (!email) {
      toast.error("Por favor, preencha o e-mail.");
      return;
    }

    try {
      // if (itemToEdit) {
      //   const response = await axios.put(
      //     `${BASE_URL}/usuarios/${itemToEdit.id}`,
      //     {
      //       nome: user,
      //       email: email,
      //       tipo_usuario: userRole,
      //       genero: gender,
      //     }
      //   );
      //   if (response.status === 200) {
      //     toast.success("Usuário atualizado com sucesso!");
      //     await update();
      //     closeDialog();
      //   } else {
      //     toast.error("Erro ao atualizar usuário");
      //   }
      // } else {
      //   const response = await axios.post(`${BASE_URL}/usuarios`, {
      //     nome: user,
      //     senha: password,
      //     email: email,
      //     tipo_usuario: userRole,
      //     genero: gender,
      //   });
      //   if (response.status === 201) {
      //     toast.success("Usuário cadastrado com sucesso!");
      //     await update();
      //     closeDialog();
      //   } else {
      //     toast.error("Erro ao cadastrar usuário");
      //   }
      // }
      toast.success("Usuário atualizado com sucesso!");
      await update();
      closeDialog();
    } catch (error) {
      console.error("Erro ao cadastrar/atualizar usuário", error);
      toast.error("Erro ao cadastrar/atualizar usuário");
    }
  };

  const footer = (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        gap: "1rem",
      }}
    >
      <Button label="Salvar" onClick={handleSave} />
      <Button label="Cancelar" buttonType="secondary" onClick={closeDialog} />
    </div>
  );

  return (
    <Dialog
      header={itemToEdit ? "Editar" : "Cadastrar"}
      visible={visible}
      style={{ width: "50vw" }}
      onHide={closeDialog}
      footer={footer}
    >
      <Input
        label="Usuario"
        value={user}
        onChange={onChangeUser}
        width="100%"
      />
      {!itemToEdit && (
        <Input
          label="Senha"
          value={password}
          onChange={onChangePassword}
          type="password"
          width="100%"
        />
      )}
      <Input
        label="Email"
        value={email}
        onChange={onChangeEmail}
        width="100%"
      />
      <Dropdown
        options={userRoleOptions}
        value={userRole}
        onChange={onChangeUserRole}
        label="Tipo de usuário"
        width="100%"
      />
      <Dropdown
        options={genderOptions}
        value={gender}
        onChange={onChangeGender}
        label="Gênero"
        width="100%"
      />
    </Dialog>
  );
};

export default UsuariosDialog;
