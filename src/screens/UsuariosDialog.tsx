import { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { toast } from "react-toastify";
import { UsuarioCompleto } from "../types";
import { Button, Input } from "../components";
import { ProgressSpinner } from "primereact/progressspinner";
import axios from "axios";
import { BASE_URL } from "../server";
import { useAuth } from "../context";

interface UsuariosDialogProps {
  visible: boolean;
  closeDialog: () => void;
  itemToEdit?: UsuarioCompleto;
  update: () => void;
}

const UsuariosDialog = ({
  visible,
  closeDialog,
  itemToEdit,
  update,
}: UsuariosDialogProps) => {
  const [usuario, setUsuario] = useState<UsuarioCompleto>({
    id: "",
    name: "",
    profile_picture: "",
    date_created: new Date(),
    email: "",
    is_active: true,
    is_staff: true,
    is_superuser: true,
    last_login: new Date(),
    about_me: "",
    serial_number: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { accessToken } = useAuth();

  useEffect(() => {
    if (itemToEdit) {
      setUsuario(itemToEdit);
    } else {
      setUsuario({
        id: "",
        name: "",
        profile_picture: "",
        date_created: new Date(),
        email: "",
        is_active: true,
        is_staff: true,
        is_superuser: true,
        last_login: new Date(),
        about_me: "",
        serial_number: "",
      });
    }
  }, [itemToEdit]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const token = accessToken;
      if (itemToEdit) {
        await axios.put(`${BASE_URL}/auth/profile/${itemToEdit.id}/`, usuario, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("Uuário editado com sucesso!");
      } else {
        await axios.post(`${BASE_URL}/auth/profile/`, usuario, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("Usuário criado com sucesso!");
      }
      closeDialog();
      update();
    } catch (error) {
      console.error("Erro ao salvar usuário:", error);
      toast.error("Erro ao salvar usuário");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof UsuarioCompleto, value: any) => {
    setUsuario((prev) => ({ ...prev, [field]: value }));
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
        value={usuario.name}
        width="100%"
        onChange={(value) => handleInputChange("name", value)}
      />
      <Input
        label="Matrícula"
        value={usuario.serial_number}
        width="100%"
        onChange={(value) => handleInputChange("serial_number", value)}
      />
      <Input
        label="Descrição"
        value={usuario.about_me}
        width="100%"
        onChange={(value) => handleInputChange("about_me", value)}
      />
    </Dialog>
  );
};

export default UsuariosDialog;
