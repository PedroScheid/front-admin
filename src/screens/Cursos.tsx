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
import { confirmDialog } from "primereact/confirmdialog";
import editIcon from "../icons/editar.png";
import deleteIcon from "../icons/excluir.png";

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

  const onDelete = (rowData: Curso) => {
    confirmDialog({
      message: `Você realmente deseja excluir o curso '${rowData.name}'?`,
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
      await axios.delete(`${BASE_URL}/courses/courses/admin/${id}/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      toast.success("Curso deletado com sucesso!");
      refetch();
    } catch (error) {
      console.error("Erro ao excluir curso:", error);
      toast.error("Erro ao excluir curso");
    }
  };

  const editBody = (rowData: Curso) => {
    return (
      <PrimeButton
        style={{ backgroundColor: "#FFFFFF" }}
        onClick={() => handleEdit(rowData)}
      >
        <img src={editIcon} alt="edit-icon" />
      </PrimeButton>
    );
  };

  const deleteBody = (rowData: Curso) => {
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

  const getIsRequired = (is_active: boolean) => {
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
        {is_active ? "SIM" : "NÃO"}
      </div>
    );
  };

  const getIsActive = (is_active: boolean) => {
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

  const getAdjustedDate = (date: string) => new Date(date).toLocaleString();

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
        <Column field="description" header="Descrição" />
        <Column field="expiration_time_in_days" header="Dias para expirar" />
        <Column
          field="required_for_function"
          header="Necessário para função"
          body={(d) => getIsRequired(d.required_for_function)}
        />
        <Column
          field="date_created"
          header="Data de criação"
          body={(d) => getAdjustedDate(d.date_created)}
        />
        <Column
          field="is_active"
          header="Ativo"
          body={(d) => getIsActive(d.is_active)}
        />
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
