import { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Checkbox } from "primereact/checkbox";
import { toast } from "react-toastify";
import { Curso } from "../types";
import { Button, Input } from "../components";
import { ProgressSpinner } from "primereact/progressspinner";
import axios from "axios";
import { BASE_URL } from "../server";
import { useAuth } from "../context";

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
    class_file: "",
    class_file_type: "",
    course: "",
    id: "",
    sequence_in_course: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const { accessToken } = useAuth();

  useEffect(() => {
    if (itemToEdit) {
      setCurso(itemToEdit);
    } else {
      setCurso({
        name: "",
        class_file: "",
        class_file_type: "",
        course: "",
        id: "",
        sequence_in_course: 0,
      });
    }
  }, [itemToEdit]);

  const handleInputChange = (field: keyof Curso, value: any) => {
    setCurso((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!curso.name.trim() || !curso.course.trim()) {
      toast.error("Nome e curso são obrigatórios.");
      return;
    }

    if (isNaN(curso.sequence_in_course) || curso.sequence_in_course <= 0) {
      toast.error("Dias para expiração deve ser um número maior que zero.");
      return;
    }

    setIsLoading(true);
    try {
      const token = accessToken;
      const response = await axios.post(
        `${BASE_URL}/courses/all/create/`,
        curso,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Curso salvo com sucesso!");
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
        label="Curso"
        value={curso.course}
        onChange={(value) => handleInputChange("course", value)}
        width="100%"
      />
      <Input
        label="Dias de Expiração"
        value={curso.sequence_in_course.toString()}
        onChange={(value) =>
          handleInputChange("sequence_in_course", parseInt(value) || 0)
        }
        width="80px"
      />
    </Dialog>
  );
};

export default CursosDialog;
