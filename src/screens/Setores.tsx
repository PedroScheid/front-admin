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
import { Setor } from "../types";
import SetoresDialog from "./SetoresDialog";
import editIcon from "../icons/editar.png";
import deleteIcon from "../icons/excluir.png";
import { confirmDialog } from "primereact/confirmdialog";

const fetchSetores = async (accessToken: string | null): Promise<Setor[]> => {
  const response = await axios.get<Setor[]>(`${BASE_URL}/perms/sector/`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};

const Setores = () => {
  const [visible, setVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<Setor | undefined>();
  const { accessToken } = useAuth();

  // Usando React Query para buscar dados
  const {
    data: setores = [],
    refetch,
    isLoading,
  } = useQuery<Setor[], Error>({
    queryKey: ["setor"],
    queryFn: () => fetchSetores(accessToken),
    enabled: !!accessToken,
  });

  const handleCloseDialog = () => {
    setVisible(false);
    setEditingItem(undefined);
  };

  const handleEdit = (value: Setor) => {
    setEditingItem(value);
    setVisible(true);
  };

  const onDelete = (sector: Setor) => {
    confirmDialog({
      message: `Você realmente deseja excluir o setor '${sector.name}'?`,
      header: "Confirmação de exclusão",
      icon: "pi pi-info-circle",
      defaultFocus: "reject",
      acceptClassName: "p-button-danger",
      accept: () => handleDelete(sector.id),
      acceptLabel: "Sim",
      rejectClassName: "p-button-secondary",
      rejectLabel: "Não",
    });
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${BASE_URL}/perms/sector/${id}/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      toast.success("Setor deletado com sucesso!");
      refetch();
    } catch (error) {
      console.error("Erro ao excluir setor:", error);
      toast.error("Erro ao excluir setor");
    }
  };

  const editBody = (rowData: Setor) => {
    return (
      <PrimeButton
        style={{ backgroundColor: "#FFFFFF" }}
        onClick={() => handleEdit(rowData)}
      >
        <img src={editIcon} alt="edit-icon" />
      </PrimeButton>
    );
  };

  const deleteBody = (rowData: Setor) => {
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

  return (
    <div className="App">
      <NavBar />
      <DataTable
        loading={isLoading}
        value={setores}
        tableStyle={{ width: "100vw", padding: "1rem" }}
        dataKey="id"
        header={
          <Button
            label="Cadastrar"
            buttonType="secondary"
            onClick={() => setVisible(true)}
          />
        }
      >
        <Column body={editBody} align="left" bodyStyle={{ width: 0 }} />
        <Column body={deleteBody} align="left" />
        <Column field="name" header="Nome" />
        <Column field="description" header="Descrição" />
      </DataTable>
      {visible && (
        <SetoresDialog
          closeDialog={handleCloseDialog}
          update={refetch}
          visible={visible}
          itemToEdit={editingItem}
        />
      )}
    </div>
  );
};

export default Setores;
