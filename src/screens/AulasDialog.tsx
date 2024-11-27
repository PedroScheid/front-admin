import { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { toast } from "react-toastify";
import { Aula, Curso, Funcao } from "../types";
import { Button, Input } from "../components";
import { ProgressSpinner } from "primereact/progressspinner";
import axios from "axios";
import { BASE_URL } from "../server";
import { useAuth } from "../context";
import { Dropdown } from "primereact/dropdown";
import { useQuery } from "@tanstack/react-query";

interface CursosDialogProps {
  visible: boolean;
  closeDialog: () => void;
  itemToEdit?: Aula;
  update: () => void;
}

const fetchCursos = async (accessToken: string | null): Promise<Curso[]> => {
  const response = await axios.get<Curso[]>(
    `${BASE_URL}/courses/courses/admin/`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
};

const conteudoOptions = [
  { label: "Image", value: "image" },
  { label: "Video", value: "video" },
  { label: "PDF", value: "pdf" },
];

const AulasDialog = ({
  visible,
  closeDialog,
  itemToEdit,
  update,
}: CursosDialogProps) => {
  const [curso, setCurso] = useState<Aula>({
    name: "",
    description: "",
    class_file: "",
    class_file_type: "",
    course: "",
    id: "",
    sequence_in_course: 1,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isFileLoading, setIsFileLoading] = useState(false);

  const { accessToken } = useAuth();

  const { data: cursos = [] } = useQuery<Curso[], Error>({
    queryKey: ["cursos"],
    queryFn: () => fetchCursos(accessToken),
    enabled: !!accessToken,
  });

  useEffect(() => {
    if (itemToEdit) {
      setCurso(itemToEdit);
    } else {
      setCurso({
        name: "",
        description: "",
        class_file: "",
        class_file_type: "",
        course: "",
        id: "",
        sequence_in_course: 1,
      });
    }
  }, [itemToEdit]);

  const handleInputChange = (field: keyof Aula, value: any) => {
    setCurso((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();

      setIsFileLoading(true); // Inicia o estado de carregamento

      reader.onload = () => {
        if (reader.result) {
          const base64String = reader.result.toString().split(",")[1]; // Extrai o conteúdo base64
          setCurso((prev) => ({
            ...prev,
            class_file: base64String, // Salva o arquivo como base64
          }));
          toast.success("Arquivo carregado com sucesso!"); // Mensagem de sucesso
        }
        setIsFileLoading(false); // Finaliza o estado de carregamento
      };

      reader.onerror = () => {
        toast.error("Erro ao processar o arquivo.");
        setIsFileLoading(false); // Finaliza o estado de carregamento mesmo em erro
      };

      reader.readAsDataURL(file); // Lê o arquivo como Data URL (base64)
    }
  };
  const handleSave = async () => {
    if (!curso.name.trim()) {
      toast.error("Nome é obrigatório.");
      return;
    }

    setIsLoading(true);
    try {
      const token = accessToken;
      await axios.post(`${BASE_URL}/courses/classes/`, curso, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
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
        label="Descrição"
        value={curso.description}
        onChange={(value) => handleInputChange("description", value)}
        width="100%"
      />
      <div
        style={{ display: "flex", flexDirection: "column", marginBottom: 10 }}
      >
        <span>Curso</span>
        <Dropdown
          onChange={(value) => handleInputChange("course", value.value)}
          options={cursos}
          value={curso.course}
          optionValue="id"
          optionLabel="name"
        />
      </div>
      <div
        style={{ display: "flex", flexDirection: "column", marginBottom: 10 }}
      >
        <span>Conteúdo</span>
        <Dropdown
          onChange={(value) =>
            handleInputChange("class_file_type", value.value)
          }
          options={conteudoOptions}
          value={curso.class_file_type}
          optionLabel="label"
          optionValue="value"
        />
      </div>
      <div
        style={{ display: "flex", flexDirection: "column", marginBottom: 10 }}
      >
        <label htmlFor="file-upload">Arquivo</label>
        <input
          type="file"
          id="file-upload"
          onChange={handleFileUpload}
          accept=".pdf,.mp4,.jpg,.png"
        />
        {isFileLoading && (
          <div style={{ marginTop: 10 }}>
            <ProgressSpinner
              style={{ width: "20px", height: "20px" }}
              strokeWidth="4"
            />
            <span>Carregando arquivo...</span>
          </div>
        )}
      </div>
      {/* <Input
        label="Dias de Expiração"
        value={curso.sequence_in_course.toString()}
        onChange={(value) =>
          handleInputChange("sequence_in_course", parseInt(value) || 0)
        }
        width="80px"
      /> */}
    </Dialog>
  );
};

export default AulasDialog;
