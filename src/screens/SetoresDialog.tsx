import { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { toast } from "react-toastify";
import { Setor } from "../types";
import { Button, Input } from "../components";
import { ProgressSpinner } from "primereact/progressspinner";
import axios from "axios";
import { BASE_URL } from "../server";
import { useAuth } from "../context";

interface SetoresDialogProps {
  visible: boolean;
  closeDialog: () => void;
  itemToEdit?: Setor;
  update: () => void;
}

const SetoresDialog = ({
  visible,
  closeDialog,
  itemToEdit,
  update,
}: SetoresDialogProps) => {
  const [setor, setSetor] = useState<Setor>({
    id: "",
    name: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { accessToken } = useAuth();

  useEffect(() => {
    if (itemToEdit) {
      setSetor(itemToEdit);
    } else {
      setSetor({
        id: "",
        name: "",
        description: "",
      });
    }
  }, [itemToEdit]);

  const handleInputChange = (field: keyof Setor, value: any) => {
    setSetor((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!setor.name.trim() || !setor.description.trim()) {
      toast.error("Nome e descrição são obrigatórios.");
      return;
    }

    setIsLoading(true);
    try {
      const token = accessToken;
      const response = await axios.post(`${BASE_URL}/perms/sector/`, setor, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Setor salvo com sucesso!");
      closeDialog();
      update();
    } catch (error) {
      console.error("Erro ao salvar Setor:", error);
      toast.error("Erro ao salvar setor");
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
      visible={visible}
      style={{ width: "450px" }}
      header={itemToEdit ? "Editar" : "Cadastrar"}
      modal
      onHide={closeDialog}
      footer={footer}
    >
      <Input
        label="Nome"
        value={setor.name}
        onChange={(value) => handleInputChange("name", value)}
        width="100%"
      />
      <Input
        label="Descrição"
        value={setor.description}
        onChange={(value) => handleInputChange("description", value)}
        width="100%"
      />
    </Dialog>
  );
};

export default SetoresDialog;
