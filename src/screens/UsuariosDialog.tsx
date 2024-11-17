import "../App.css";
import "primereact/resources/themes/bootstrap4-dark-blue/theme.css";
import { Button, Input } from "../components";
import { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { ProgressSpinner } from "primereact/progressspinner";
import { toast } from "react-toastify";
import { RegisterUser, Usuario } from "../types";
import axios from "axios";
import { BASE_URL } from "../server";

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
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (itemToEdit) {
      setPassword(itemToEdit.senha);
      setEmail(itemToEdit.email);
    } else {
      setPassword("");
      setPassword2("");
    }
  }, [itemToEdit]);

  const onChangePassword = (value: string) => {
    setPassword(value);
  };

  const onChangePassword2 = (value: string) => {
    setPassword2(value);
  };

  const onChangeEmail = (value: string) => {
    setEmail(value);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSave = async () => {
    if (!password || !password2 || !email) {
      toast.error("Todos os campos devem ser preenchidos.");
      return;
    }

    if (!validateEmail(email)) {
      toast.error("Por favor, insira um e-mail válido.");
      return;
    }

    if (password.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (password !== password2) {
      toast.error("As senhas não coincidem.");
      return;
    }

    const newUser: RegisterUser = {
      email: email,
      password1: password,
      password2: password2,
    };

    setIsLoading(true); // Ativa o estado de carregamento
    try {
      const response = await axios.post(`${BASE_URL}/auth/register/`, newUser);
      toast.success("Usuário cadastrado com sucesso!");
      closeDialog();
      await update();
    } catch (error) {
      console.error("Erro na requisição:", error);
      toast.error("Erro ao cadastrar usuário");
    } finally {
      setIsLoading(false); // Desativa o estado de carregamento
    }
  };

  const footer = (
    <div style={{ display: "flex", flexDirection: "row", gap: "1rem" }}>
      <Button label="Salvar" onClick={handleSave} disabled={isLoading}>
        {isLoading && (
          <ProgressSpinner
            style={{ width: "20px", height: "20px" }}
            strokeWidth="4"
          />
        )}
      </Button>
      <Button
        label="Cancelar"
        buttonType="secondary"
        onClick={closeDialog}
        disabled={isLoading}
      />
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
        label="Email"
        value={email}
        onChange={onChangeEmail}
        width="100%"
      />
      {!itemToEdit && (
        <>
          <Input
            label="Senha"
            value={password}
            onChange={onChangePassword}
            type="password"
            width="100%"
          />
          <Input
            label="Confirmar Senha"
            value={password2}
            onChange={onChangePassword2}
            type="password"
            width="100%"
          />
        </>
      )}
    </Dialog>
  );
};

export default UsuariosDialog;
