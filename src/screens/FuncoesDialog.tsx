import { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { toast } from "react-toastify";
import { Funcao, SubSetor } from "../types";
import { Button, Input } from "../components";
import { Checkbox } from "primereact/checkbox";
import { ProgressSpinner } from "primereact/progressspinner";
import axios from "axios";
import { BASE_URL } from "../server";
import { useAuth } from "../context";
import { useQuery } from "@tanstack/react-query";
import { Dropdown } from "primereact/dropdown";

interface FuncoesDialogProps {
  visible: boolean;
  closeDialog: () => void;
  itemToEdit?: Funcao;
  update: () => void;
}

const fetchSubSetores = async (
  accessToken: string | null
): Promise<SubSetor[]> => {
  const response = await axios.get<SubSetor[]>(`${BASE_URL}/perms/subsector/`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};

const FuncoesDialog = ({
  visible,
  closeDialog,
  itemToEdit,
  update,
}: FuncoesDialogProps) => {
  const [funcao, setFuncao] = useState<Funcao>({
    id: "",
    name: "",
    description: "",
    subsector: "",
    date_created: new Date(),
    is_active: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const { accessToken } = useAuth();

  const { data: subSetores = [] } = useQuery<SubSetor[], Error>({
    queryKey: ["subsetor"],
    queryFn: () => fetchSubSetores(accessToken),
    enabled: !!accessToken,
  });

  useEffect(() => {
    if (itemToEdit) {
      setFuncao(itemToEdit);
    } else {
      setFuncao({
        id: "",
        name: "",
        description: "",
        subsector: "",
        date_created: new Date(),
        is_active: true,
      });
    }
  }, [itemToEdit]);

  const handleInputChange = (field: keyof Funcao, value: any) => {
    setFuncao((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!funcao.name.trim() || !funcao.description.trim()) {
      toast.error("Nome e descrição são obrigatórios.");
      return;
    }

    setIsLoading(true);
    try {
      const token = accessToken;
      if (itemToEdit) {
        await axios.put(
          `${BASE_URL}/perms/function/${itemToEdit.id}/`,
          funcao,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success("Função editada com sucesso!");
      } else {
        await axios.post(`${BASE_URL}/perms/function/`, funcao, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("Função criada com sucesso!");
      }
      closeDialog();
      update();
    } catch (error) {
      console.error("Erro ao salvar Função:", error);
      toast.error("Erro ao salvar função");
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
        value={funcao.name}
        onChange={(value) => handleInputChange("name", value)}
        width="100%"
      />
      <Input
        label="Descrição"
        value={funcao.description}
        onChange={(value) => handleInputChange("description", value)}
        width="100%"
      />
      <div
        style={{ display: "flex", flexDirection: "column", marginBottom: 10 }}
      >
        <span>Linha</span>
        <Dropdown
          onChange={(value) => handleInputChange("subsector", value.value)}
          options={subSetores}
          value={funcao.subsector}
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
        }}
      >
        <Checkbox
          title="Ativo"
          checked={funcao.is_active}
          onChange={(value) => handleInputChange("is_active", value.checked)}
        />
        <span>Ativo</span>
      </div>
    </Dialog>
  );
};

export default FuncoesDialog;
