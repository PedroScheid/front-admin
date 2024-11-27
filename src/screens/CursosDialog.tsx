import { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { toast } from "react-toastify";
import { Curso } from "../types";
import { Button, Input } from "../components";
import { ProgressSpinner } from "primereact/progressspinner";
import axios from "axios";
import { BASE_URL } from "../server";
import { useAuth } from "../context";
import { Checkbox } from "primereact/checkbox";

interface CursosDialogProps {
  visible: boolean;
  closeDialog: () => void;
  itemToEdit?: Curso;
  update: () => void;
}

const CursosDialog = ({
  visible,
  closeDialog,
  itemToEdit,
  update,
}: CursosDialogProps) => {
  const [curso, setCurso] = useState<Curso>({
    name: "",
    description: "",
    created_by: "",
    date_created: new Date(),
    expiration_time_in_days: 0,
    id: "",
    is_active: true,
    last_modified_date: new Date(),
    modified_by: "",
    required_for_function: true,
  });
  const [isLoading, setIsLoading] = useState(false);

  const { accessToken } = useAuth();

  useEffect(() => {
    if (itemToEdit) {
      setCurso(itemToEdit);
    } else {
      setCurso({
        name: "",
        description: "",
        created_by: "",
        date_created: new Date(),
        expiration_time_in_days: 0,
        id: "",
        is_active: true,
        last_modified_date: new Date(),
        modified_by: "",
        required_for_function: true,
      });
    }
  }, [itemToEdit]);

  const handleInputChange = (field: keyof Curso, value: any) => {
    setCurso((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!curso.name.trim()) {
      toast.error("Nome é obrigatório.");
      return;
    }

    const expirationTime = Number(curso.expiration_time_in_days);

    if (isNaN(expirationTime) || expirationTime <= 0) {
      toast.error(
        "O tempo de expiração deve ser um número válido maior que zero."
      );
      return;
    }

    setIsLoading(true);
    try {
      const token = accessToken;
      const cursoAjustado = {
        name: curso.name,
        description: curso.description,
        expiration_time_in_days: Number(curso.expiration_time_in_days),
        required_for_function: curso.required_for_function,
        is_active: curso.is_active,
      };
      if (itemToEdit) {
        await axios.put(
          `${BASE_URL}/courses/courses/admin/${itemToEdit.id}/`,
          cursoAjustado,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success("Curso editado com sucesso!");
      } else {
        await axios.post(`${BASE_URL}/courses/courses/admin/`, cursoAjustado, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("Curso criado com sucesso!");
      }
      closeDialog();
      update();
    } catch (error) {
      console.error("Erro ao salvar curso:", error);
      toast.error("Erro ao salvar curso");
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
        value={curso.name}
        onChange={(value) => handleInputChange("name", value)}
        width="100%"
      />
      <Input
        label="Descrição"
        value={curso.description}
        onChange={(value) => handleInputChange("description", value)}
        width="100%"
      />
      <Input
        label="Tempo de expiração (dias)"
        value={curso.expiration_time_in_days?.toString()}
        onChange={(value) =>
          handleInputChange("expiration_time_in_days", value)
        }
        width="100%"
      />
      <div
        style={{
          gap: 10,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Checkbox
          title="Necessário para função"
          checked={curso.required_for_function}
          onChange={(value) =>
            handleInputChange("required_for_function", value.checked)
          }
        />
        <span>Necessário para função </span>
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
          checked={curso.is_active}
          onChange={(value) => handleInputChange("is_active", value.checked)}
        />
        <span>Ativo</span>
      </div>
    </Dialog>
  );
};

export default CursosDialog;
