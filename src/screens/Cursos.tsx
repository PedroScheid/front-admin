import { useState, useEffect } from "react";
import "../App.css";
import "primereact/resources/themes/bootstrap4-dark-blue/theme.css";
import { Button, NavBar } from "../components";
import { DataTable } from "primereact/datatable";
import { Button as PrimeButton } from "primereact/button";
import { Column } from "primereact/column";
import { toast } from "react-toastify";
import CursosDialog from "./CursosDialog";
import axios from "axios";
import { BASE_URL } from "../server";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../context";
import { Curso } from "../types";

const fetchCursos = async (accessToken: string | null): Promise<Curso[]> => {
  const response = await axios.get<Curso[]>(`${BASE_URL}/courses/classes/`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};

const Cursos = () => {
  const [visible, setVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<Curso | undefined>();
  const { accessToken } = useAuth();

  // Usando React Query para buscar dados
  const {
    data: cursos = [],
    refetch,
    isLoading,
  } = useQuery<Curso[], Error>({
    queryKey: ["cursos"],
    queryFn: () => fetchCursos(accessToken),
    enabled: !!accessToken,
  });

  const handleCloseDialog = () => {
    setVisible(false);
    setEditingItem(undefined);
  };

  const handleEdit = (value: Curso) => {
    setEditingItem(value);
    setVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      // Simulando exclusão bem-sucedida
      toast.success("Treinamento deletado com sucesso!");
      refetch(); // Atualiza a lista após exclusão
    } catch (error) {
      console.error("Erro ao excluir treinamento:", error);
      toast.error("Erro ao excluir treinamento");
    }
  };

  const editBody = (rowData: Curso) => {
    return (
      <PrimeButton
        icon="pi pi-pencil"
        style={{ backgroundColor: "#FFFFFF", borderColor: "#FFFFFF" }}
        onClick={() => handleEdit(rowData)}
      />
    );
  };

  const deleteBody = (rowData: Curso) => {
    return (
      <PrimeButton
        icon="pi pi-trash"
        style={{ backgroundColor: "#FF0000", borderColor: "#FF0000" }}
        onClick={() => handleDelete(rowData.id)}
      />
    );
  };

  return (
    <div className="App">
      <NavBar />
      <DataTable
        value={cursos}
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
        <Column field="sequence_in_course" header="Ordem no Curso" />
        <Column field="class_file_type" header="Tipo de Arquivo" />
        <Column field="class_file" header="Arquivo" />
      </DataTable>
      {visible && (
        <CursosDialog
          closeDialog={handleCloseDialog}
          update={refetch}
          visible={visible}
          itemToEdit={editingItem}
        />
      )}
    </div>
  );
};

export default Cursos;
