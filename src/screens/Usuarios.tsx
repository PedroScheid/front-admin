import { useState, useEffect } from "react";
import "../App.css";
import "primereact/resources/themes/bootstrap4-dark-blue/theme.css";
import { Button, NavBar } from "../components";
import { DataTable } from "primereact/datatable";
import { Button as PrimeButton } from "primereact/button";
import { Column } from "primereact/column";
import { UsuarioProps } from "../types";
import { toast } from "react-toastify";
import UsuariosDialog from "./UsuariosDialog";
import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../server";
import axios from "axios";
import { useAuth } from "../context";
import editIcon from "../icons/editar.png";
import deleteIcon from "../icons/excluir.png";
import { confirmDialog } from "primereact/confirmdialog";

const fetchUsuarios = async (
  accessToken: string | null
): Promise<UsuarioProps[]> => {
  const response = await axios.get<UsuarioProps[]>(
    `${BASE_URL}/perms/user_function/`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
};

const Usuarios = () => {
  const [visible, setVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<UsuarioProps>();
  const { accessToken } = useAuth();

  const {
    data: usuarios = [],
    refetch,
    isLoading,
  } = useQuery<UsuarioProps[], Error>({
    queryKey: ["usuario"],
    queryFn: () => fetchUsuarios(accessToken),
    enabled: !!accessToken,
  });

  const handleCloseDialog = () => {
    setVisible(false);
    setEditingItem(undefined);
  };

  const handleEdit = (value: UsuarioProps) => {
    setEditingItem(value);
    setVisible(true);
  };

  const onDelete = (user: UsuarioProps) => {
    confirmDialog({
      message: `Você realmente deseja excluir o usuário '${user.user.email}'?`,
      header: "Confirmação de exclusão",
      icon: "pi pi-info-circle",
      defaultFocus: "reject",
      acceptClassName: "p-button-danger",
      accept: () => handleDelete(user.id),
      acceptLabel: "Sim",
      rejectClassName: "p-button-secondary",
      rejectLabel: "Não",
    });
  };

  const handleDelete = async (id: string) => {
    try {
      toast.success("Usuário deletado com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir Usuário:", error);
      toast.error("Erro ao excluir Usuário");
    }
  };

  const editBody = (rowData: UsuarioProps) => {
    return (
      <PrimeButton
        style={{ backgroundColor: "#FFFFFF" }}
        onClick={() => handleEdit(rowData)}
      >
        <img src={editIcon} alt="edit-icon" />
      </PrimeButton>
    );
  };

  const deleteBody = (rowData: UsuarioProps) => {
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
        value={usuarios}
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
        <Column field="email" header="Email" />
      </DataTable>
      {visible && (
        <UsuariosDialog
          visible={visible}
          closeDialog={handleCloseDialog}
          itemToEdit={editingItem}
          update={refetch}
        />
      )}
    </div>
  );
};

export default Usuarios;
