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
import { Setor, SubSetor } from "../types";
import editIcon from "../icons/editar.png";
import deleteIcon from "../icons/excluir.png";
import SubSetoresDialog from "./SubSetoresDialog";
import { confirmDialog } from "primereact/confirmdialog";

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

const fetchSetores = async (accessToken: string | null): Promise<Setor[]> => {
  const response = await axios.get<Setor[]>(`${BASE_URL}/perms/sector/`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};

const SubSetores = () => {
  const [visible, setVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<SubSetor | undefined>();
  const { accessToken } = useAuth();

  // Usando React Query para buscar dados
  const {
    data: subSetores = [],
    refetch,
    isLoading,
  } = useQuery<SubSetor[], Error>({
    queryKey: ["subsetor"],
    queryFn: () => fetchSubSetores(accessToken),
    enabled: !!accessToken,
  });

  const { data: setores = [] } = useQuery<Setor[], Error>({
    queryKey: ["setor"],
    queryFn: () => fetchSetores(accessToken),
    enabled: !!accessToken,
  });

  const handleCloseDialog = () => {
    setVisible(false);
    setEditingItem(undefined);
  };

  const handleEdit = (value: SubSetor) => {
    setEditingItem(value);
    setVisible(true);
  };

  const onDelete = (subsector: SubSetor) => {
    confirmDialog({
      message: `Você realmente deseja excluir o sub setor '${subsector.name}'?`,
      header: "Confirmação de exclusão",
      icon: "pi pi-info-circle",
      defaultFocus: "reject",
      acceptClassName: "p-button-danger",
      accept: () => handleDelete(subsector.id),
      acceptLabel: "Sim",
      rejectClassName: "p-button-secondary",
      rejectLabel: "Não",
    });
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${BASE_URL}/perms/subsector/${id}/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      toast.success("Sub setor deletado com sucesso!");
      refetch();
    } catch (error) {
      console.error("Erro ao excluir sub setor:", error);
      toast.error("Erro ao excluir sub setor");
    }
  };

  const editBody = (rowData: SubSetor) => {
    return (
      <PrimeButton
        style={{ backgroundColor: "#FFFFFF" }}
        onClick={() => handleEdit(rowData)}
      >
        <img src={editIcon} alt="edit-icon" />
      </PrimeButton>
    );
  };

  const deleteBody = (rowData: SubSetor) => {
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

  const getSetor = (rowData: SubSetor) => {
    return setores.length > 0
      ? setores.find((s) => s.id === rowData.sector)?.name
      : "";
  };

  return (
    <div className="App">
      <NavBar />
      <DataTable
        value={subSetores}
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
        <Column field="description" header="Setor" body={(d) => getSetor(d)} />
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
        <SubSetoresDialog
          closeDialog={handleCloseDialog}
          update={refetch}
          visible={visible}
          itemToEdit={editingItem}
        />
      )}
    </div>
  );
};

export default SubSetores;
