import "../App.css";
import "primereact/resources/themes/bootstrap4-dark-blue/theme.css";
import { Button, Input } from "../components";
import { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { toast } from "react-toastify";
import { Usuario } from "../types";

interface TreinamentosDialogProps {
  visible: boolean;
  closeDialog: () => void;
  update: () => Promise<void>;
  itemToEdit?: Usuario;
}

const TreinamentosDialog = ({
  visible,
  closeDialog,
  update,
  itemToEdit,
}: TreinamentosDialogProps) => {
  const [treinamento, setTreinamento] = useState("");
  const [tipoTreinamento, setTipoTreinamento] = useState("");

  useEffect(() => {
    if (itemToEdit) {
      setTreinamento(itemToEdit.nome);
      setTipoTreinamento(itemToEdit.email);
    } else {
      setTreinamento("");
      setTipoTreinamento("");
    }
  }, [itemToEdit]);

  const onChangeTreinamento = (value: string) => {
    setTreinamento(value);
  };

  const onChangeTipoTreinamento = (value: string) => {
    setTipoTreinamento(value);
  };

  const handleSave = async () => {
    if (!treinamento) {
      toast.error("Por favor, preencha o treinamento.");
      return;
    }

    if (!tipoTreinamento) {
      toast.error("Por favor, preencha o tipo de treinamento.");
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
      toast.success("Treinamento atualizado com sucesso!");
      await update();
      closeDialog();
    } catch (error) {
      console.error("Erro ao cadastrar/atualizar treinamento", error);
      toast.error("Erro ao cadastrar/atualizar treinamento");
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
        label="Treinamento"
        value={treinamento}
        onChange={onChangeTreinamento}
        width="100%"
      />
      <Input
        label="Tipo de Treinamento"
        value={tipoTreinamento}
        onChange={onChangeTipoTreinamento}
        width="100%"
      />
    </Dialog>
  );
};

export default TreinamentosDialog;
