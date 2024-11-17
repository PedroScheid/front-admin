import { useState, useEffect } from "react";
import "../App.css";
import "primereact/resources/themes/bootstrap4-dark-blue/theme.css";
import { Button, NavBar } from "../components";
import { DataTable } from "primereact/datatable";
import { Button as PrimeButton } from "primereact/button";
import { Column } from "primereact/column";
import { Usuario } from "../types";
import { toast } from "react-toastify";
import UsuariosDialog from "./UsuariosDialog";

const Usuarios = () => {
  const [visible, setVisible] = useState(false);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [editingItem, setEditingItem] = useState<Usuario>();

  const fetchUsuarios = async () => {
    try {
      //   const response = await fetch(`${BASE_URL}/usuarios`);
      //   const data = await response.json();
      //   setUsuarios(data);
    } catch (error) {
      console.error("Erro ao buscar usuarios:", error);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleCloseDialog = () => {
    setVisible(false);
    setEditingItem(undefined);
  };

  const handleEdit = (value: Usuario) => {
    setEditingItem(value);
    setVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      //   const response = await fetch(
      //     `${BASE_URL}/usuarios/${id}?idLoggedUser=${idLoggedUser}`,
      //     {
      //       method: "DELETE",
      //     }
      //   );

      //   if (!response.ok) {
      //     const errorData = await response.json();
      //     if (response.status === 400 && errorData.error) {
      //       toast.error(errorData.error);
      //     } else {
      //       throw new Error("Erro ao excluir usuário");
      //     }
      //     return;
      //   }

      //   const updatedUsuarios = usuarios.filter((tipo) => tipo.id !== id);
      //   setUsuarios(updatedUsuarios);
      toast.success("Usuário deletado com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir Usuário:", error);
      toast.error("Erro ao excluir Usuário");
    }
  };

  const editBody = (rowData: Usuario) => {
    return (
      <PrimeButton
        icon="pi pi-pencil"
        style={{ backgroundColor: "#FFFFFF", borderColor: "#FFFFFF" }}
        onClick={() => handleEdit(rowData)}
      />
    );
  };

  const deleteBody = (rowData: Usuario) => {
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
          update={fetchUsuarios}
        />
      )}
    </div>
  );
};

export default Usuarios;
