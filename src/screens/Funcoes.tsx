import { useState } from "react";
import "../App.css";
import "primereact/resources/themes/bootstrap4-dark-blue/theme.css";
import { Button, NavBar } from "../components";
import { DataTable } from "primereact/datatable";
import { Button as PrimeButton } from "primereact/button";
import { Column } from "primereact/column";
import { toast } from "react-toastify";
import axios from "axios";
import { BASE_URL } from "../server";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../context";
import { Funcao } from "../types";
import FuncoesDialog from "./FuncoesDialog";
import editIcon from "../icons/editar.png";
import deleteIcon from "../icons/excluir.png";
import { confirmDialog } from "primereact/confirmdialog";

const fetchFuncoes = async (accessToken: string | null): Promise<Funcao[]> => {
  const response = await axios.get<Funcao[]>(`${BASE_URL}/perms/function/`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};

const Funcoes = () => {
  const [visible, setVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<Funcao | undefined>();
  const { accessToken } = useAuth();

  const {
    data: funcoes = [],
    refetch,
    isLoading,
  } = useQuery<Funcao[], Error>({
    queryKey: ["funcoes"],
    queryFn: () => fetchFuncoes(accessToken),
    enabled: !!accessToken,
  });

  const handleCloseDialog = () => {
    setVisible(false);
    setEditingItem(undefined);
  };

  const handleEdit = (value: Funcao) => {
    setEditingItem(value);
    setVisible(true);
  };

  const onDelete = (rowData: Funcao) => {
    confirmDialog({
      message: `Você realmente deseja excluir a função '${rowData.name}'?`,
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
      await axios.delete(`${BASE_URL}/perms/function/${id}/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      toast.success("Função deletada com sucesso!");
      refetch();
    } catch (error) {
      console.error("Erro ao excluir função:", error);
      toast.error("Erro ao excluir função");
    }
  };

  const editBody = (rowData: Funcao) => {
    return (
      <PrimeButton
        style={{ backgroundColor: "#FFFFFF" }}
        onClick={() => handleEdit(rowData)}
      >
        <img src={editIcon} alt="edit-icon" />
      </PrimeButton>
    );
  };

  const deleteBody = (rowData: Funcao) => {
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

  const getAdjustedDate = (date: string) => new Date(date).toLocaleString();

  const getIsFunctionActive = (is_active: boolean) => {
    return (
      <div
        style={{
          display: "inline-block",
          padding: "4px 12px",
          backgroundColor: is_active ? "green" : "red",
          color: "white",
          borderRadius: "4px",
          textAlign: "center",
          fontSize: "14px",
        }}
      >
        {is_active ? "ATIVO" : "INATIVO"}
      </div>
    );
  };

  return (
    <div className="App">
      <NavBar />
      <DataTable
        value={funcoes}
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
        <Column field="description" header="Descrição" />
        <Column
          field="is_active"
          header="Ativo"
          body={(d) => getIsFunctionActive(d.is_active)}
        />
        <Column
          field="date_created"
          header="Data de Criação"
          body={(d) => getAdjustedDate(d.date_created)}
        />
      </DataTable>
      {visible && (
        <FuncoesDialog
          closeDialog={handleCloseDialog}
          update={refetch}
          visible={visible}
          itemToEdit={editingItem}
        />
      )}
    </div>
  );
};

export default Funcoes;
