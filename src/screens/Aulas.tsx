import { useState } from "react";
import "../App.css";
import "primereact/resources/themes/bootstrap4-dark-blue/theme.css";
import { Button, NavBar } from "../components";
import { DataTable } from "primereact/datatable";
import { Button as PrimeButton } from "primereact/button";
import { Column } from "primereact/column";
import { toast } from "react-toastify";
import AulasDialog from "./AulasDialog";
import axios from "axios";
import { BASE_URL } from "../server";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../context";
import { Aula, Curso } from "../types";
import { confirmDialog } from "primereact/confirmdialog";
import editIcon from "../icons/editar.png";
import deleteIcon from "../icons/excluir.png";

const fetchAulas = async (accessToken: string | null): Promise<Aula[]> => {
  const response = await axios.get<Aula[]>(`${BASE_URL}/courses/classes/`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};

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

const Aulas = () => {
  const [visible, setVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<Aula | undefined>();
  const { accessToken } = useAuth();

  // Usando React Query para buscar dados
  const {
    data: aulas = [],
    refetch,
    isLoading,
  } = useQuery<Aula[], Error>({
    queryKey: ["aulas"],
    queryFn: () => fetchAulas(accessToken),
    enabled: !!accessToken,
  });

  const { data: cursos = [] } = useQuery<Curso[], Error>({
    queryKey: ["cursos"],
    queryFn: () => fetchCursos(accessToken),
    enabled: !!accessToken,
  });

  const handleCloseDialog = () => {
    setVisible(false);
    setEditingItem(undefined);
  };

  const handleEdit = (value: Aula) => {
    setEditingItem(value);
    setVisible(true);
  };

  const onDelete = (rowData: Aula) => {
    confirmDialog({
      message: `Você realmente deseja excluir a aula '${rowData.name}'?`,
      header: "Confirmação de exclusão",
      icon: "pi pi-info-circle",
      defaultFocus: "reject",
      acceptClassName: "p-button-danger",
      accept: () => handleDelete(rowData.id),
      acceptLabel: "Sim",
      rejectClassName: "p-button-secondary",
      rejectLabel: "Não",
    });
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${BASE_URL}/courses/classes/${id}/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      toast.success("Aula deletada com sucesso!");
      refetch();
    } catch (error) {
      console.error("Erro ao excluir aula:", error);
      toast.error("Erro ao excluir aula");
    }
  };

  const editBody = (rowData: Aula) => {
    return (
      <PrimeButton
        style={{ backgroundColor: "#FFFFFF" }}
        onClick={() => handleEdit(rowData)}
      >
        <img src={editIcon} alt="edit-icon" />
      </PrimeButton>
    );
  };

  const deleteBody = (rowData: Aula) => {
    return (
      <PrimeButton
        style={{ backgroundColor: "#FF0000" }}
        onClick={() => onDelete(rowData)}
      >
        <img
          src={deleteIcon}
          alt="delete-icon"
          style={{
            filter: "invert(1)",
          }}
        />
      </PrimeButton>
    );
  };

  const getCurso = (rowData: Aula) => {
    return cursos.length > 0
      ? cursos.find((s) => s.id === rowData.course)?.name
      : "";
  };

  return (
    <div className="App">
      <NavBar />
      <DataTable
        value={aulas}
        tableStyle={{ width: "100vw", padding: "1rem" }}
        dataKey="id"
        header={
          <Button
            label="Cadastrar"
            buttonType="secondary"
            onClick={() => setVisible(true)}
          />
        }
        loading={isLoading}
      >
        <Column body={editBody} align="left" bodyStyle={{ width: 0 }} />
        <Column body={deleteBody} align="left" />
        <Column field="name" header="Nome" />
        <Column header="Aula" body={(d) => getCurso(d)} />
        <Column field="class_file_type" header="Tipo de Arquivo" />
        <Column field="class_file" header="Arquivo" />
      </DataTable>
      {visible && (
        <AulasDialog
          closeDialog={handleCloseDialog}
          update={refetch}
          visible={visible}
          itemToEdit={editingItem}
        />
      )}
    </div>
  );
};

export default Aulas;
