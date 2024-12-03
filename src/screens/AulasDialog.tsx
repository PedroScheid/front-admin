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

type UploadStatus = "idle" | "uploading" | "success" | "error";

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
    is_active: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [file, setFile] = useState<File | null>(null);

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
        is_active: true,
      });
    }
  }, [itemToEdit]);

  const handleInputChange = (field: keyof Aula, value: any) => {
    setCurso((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFile(file); // Armazene apenas o arquivo
    }
  };

  const handleSave = async () => {
    if (!curso.name.trim()) {
      toast.error("Nome é obrigatório.");
      return;
    }

    if (!file) {
      toast.error("Arquivo é obrigatório.");
      return;
    }

    setIsLoading(true);
    setStatus("uploading");

    try {
      const formData = new FormData();
      formData.append("name", curso.name);
      formData.append("description", curso.description);
      formData.append(
        "sequence_in_course",
        curso.sequence_in_course.toString()
      );
      formData.append("class_file_type", curso.class_file_type);
      formData.append("course", curso.course);
      formData.append("is_active", "true");
      formData.append("class_file", file);

      const token = accessToken;

      try {
        if (itemToEdit) {
          await axios.put(
            `${BASE_URL}/courses/classes/${itemToEdit.id}/`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
              },
              onUploadProgress: (progressEvent) => {
                const progress = progressEvent.total
                  ? Math.round(
                      (progressEvent.loaded * 100) / progressEvent.total
                    )
                  : 0;
                setUploadProgress(progress);
              },
            }
          );
          toast.success("Aula editada com sucesso!");
        } else {
          await axios.post(`${BASE_URL}/courses/classes/`, formData, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
            onUploadProgress: (progressEvent) => {
              const progress = progressEvent.total
                ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
                : 0;
              setUploadProgress(progress);
            },
          });
          toast.success("Aula criada com sucesso!");
        }
      } catch {
        setStatus("error");
        toast.error("Falha ao importar arquivo");
        setUploadProgress(0);
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
      <div
        style={{ display: "flex", flexDirection: "column", marginBottom: 10 }}
      >
        <span>Aula</span>
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
        {status === "uploading" && (
          <div className="space-y-2">
            <div className="h-2.5 w-full rounded-full bg-gray-200">
              <div
                className="h-2.5 rounded-full bg-blue-600 transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600">
              {uploadProgress}% Carregado...
            </p>
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
