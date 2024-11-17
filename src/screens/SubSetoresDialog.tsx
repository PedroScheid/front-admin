import { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { toast } from "react-toastify";
import { Setor, SubSetor } from "../types";
import { Button, Input } from "../components";
import { ProgressSpinner } from "primereact/progressspinner";
import axios from "axios";
import { BASE_URL } from "../server";
import { useAuth } from "../context";
import { Checkbox } from "primereact/checkbox";
import { Dropdown } from "primereact/dropdown";
import { useQuery } from "@tanstack/react-query";

interface SetoresDialogProps {
  visible: boolean;
  closeDialog: () => void;
  itemToEdit?: SubSetor;
  update: () => void;
}

const fetchSetores = async (accessToken: string | null): Promise<Setor[]> => {
  const response = await axios.get<Setor[]>(`${BASE_URL}/perms/sector/`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};

const SubSetoresDialog = ({
  visible,
  closeDialog,
  itemToEdit,
  update,
}: SetoresDialogProps) => {
  const [subSetor, setSubSetor] = useState<SubSetor>({
    id: "",
    name: "",
    description: "",
    date_created: new Date(),
    is_active: true,
    sector: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { accessToken } = useAuth();

  const { data: setores = [] } = useQuery<Setor[], Error>({
    queryKey: ["setor"],
    queryFn: () => fetchSetores(accessToken),
    enabled: !!accessToken,
  });

  useEffect(() => {
    if (itemToEdit) {
      setSubSetor(itemToEdit);
    } else {
      setSubSetor({
        id: "",
        name: "",
        description: "",
        date_created: new Date(),
        is_active: true,
        sector: "",
      });
    }
  }, [itemToEdit]);

  const handleInputChange = (field: keyof SubSetor, value: any) => {
    setSubSetor((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!subSetor.name.trim() || !subSetor.description.trim()) {
      toast.error("Nome e descrição são obrigatórios.");
      return;
    }

    if (!subSetor.sector) {
      toast.error("Setor é obrigatório.");
      return;
    }

    setIsLoading(true);
    try {
      const token = accessToken;
      const response = await axios.post(
        `${BASE_URL}/perms/subsector/`,
        subSetor,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Sub setor salvo com sucesso!");
      closeDialog();
      update();
    } catch (error) {
      console.error("Erro ao salvar Sub setor:", error);
      toast.error("Erro ao salvar Sub setor");
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
        value={subSetor.name}
        onChange={(value) => handleInputChange("name", value)}
        width="100%"
      />
      <Input
        label="Descrição"
        value={subSetor.description}
        onChange={(value) => handleInputChange("description", value)}
        width="100%"
      />
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span>Setor</span>
        <Dropdown
          onChange={(value) => handleInputChange("sector", value.value)}
          options={setores}
          value={subSetor.sector}
          optionValue="id"
          optionLabel="name"
        />
      </div>
      <div
        style={{
          gap: 10,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          marginTop: 10,
        }}
      >
        <Checkbox
          title="Ativo"
          checked={subSetor.is_active}
          onChange={(value) => handleInputChange("is_active", value.checked)}
        />
        <span>Ativo</span>
      </div>
    </Dialog>
  );
};

export default SubSetoresDialog;
