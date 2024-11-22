import { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { toast } from "react-toastify";
import { Funcao, UsuarioProps, UsuarioCompleto, UserFunction } from "../types";
import { Button, Input } from "../components";
import { ProgressSpinner } from "primereact/progressspinner";
import axios from "axios";
import { BASE_URL } from "../server";
import { useAuth } from "../context";
import { Dropdown } from "primereact/dropdown";
import { useQuery } from "@tanstack/react-query";

interface UsuariosDialogProps {
  visible: boolean;
  closeDialog: () => void;
  itemToEdit?: UsuarioProps;
  update: () => void;
}

const fetchUsuarios = async (
  accessToken: string | null
): Promise<UsuarioCompleto[]> => {
  const response = await axios.get<UsuarioCompleto[]>(
    `${BASE_URL}/auth/profile/`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
};

const fetchUsuariosFunction = async (
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

const fetchFuncoes = async (accessToken: string | null): Promise<Funcao[]> => {
  const response = await axios.get<Funcao[]>(`${BASE_URL}/perms/function/`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};

const MaquinasUsuariosDialog = ({
  visible,
  closeDialog,
  itemToEdit,
  update,
}: UsuariosDialogProps) => {
  const [usuario, setUsuario] = useState<UsuarioProps>({
    id: "",
    created_by: { email: "", id: "" },
    date_created: new Date(),
    function: {
      description: "",
      id: "",
      name: "",
      percent_completed: "",
      status: "",
    },
    is_obsolete: false,
    last_modified_date: new Date(),
    modified_by: { email: "", id: "" },
    permission_type: "admin",
    user: { email: "", id: "" },
  });
  const [isLoading, setIsLoading] = useState(false);
  const { accessToken } = useAuth();

  const { data: usuarios = [] } = useQuery<UsuarioCompleto[], Error>({
    queryKey: ["usuariosCompleto"],
    queryFn: () => fetchUsuarios(accessToken),
    enabled: !!accessToken,
  });

  const { data: usuariosFunction = [] } = useQuery<UsuarioProps[], Error>({
    queryKey: ["usuario"],
    queryFn: () => fetchUsuariosFunction(accessToken),
    enabled: !!accessToken,
  });

  const { data: maquinas = [] } = useQuery<Funcao[], Error>({
    queryKey: ["funcoes"],
    queryFn: () => fetchFuncoes(accessToken),
    enabled: !!accessToken,
  });

  useEffect(() => {
    if (itemToEdit) {
      setUsuario(itemToEdit);
    } else {
      setUsuario({
        id: "",
        created_by: { email: "", id: "" },
        date_created: new Date(),
        function: {
          description: "",
          id: "",
          name: "",
          percent_completed: "",
          status: "",
        },
        is_obsolete: false,
        last_modified_date: new Date(),
        modified_by: { email: "", id: "" },
        permission_type: "admin",
        user: { email: "", id: "" },
      });
    }
  }, [itemToEdit]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const token = accessToken;
      const userToSave: UserFunction = {
        function: usuario.function.id,
        is_obsolete: usuario.is_obsolete,
        permission_type: usuario.permission_type,
        user: usuario.user.id,
      };
      if (itemToEdit) {
        await axios.put(
          `${BASE_URL}/perms/user_function/${itemToEdit.id}/`,
          userToSave,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success("Máquina do usuário editada com sucesso!");
      } else {
        await axios.post(`${BASE_URL}/perms/user_function/`, userToSave, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("Máquina do usuário criada com sucesso!");
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
      {!itemToEdit ? (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span>Usuário</span>
          <Dropdown
            onChange={(value) => {
              setUsuario((prev) => ({
                ...prev,
                user: {
                  id: value.value,
                  email:
                    usuariosFunction.find((u) => u.id === value.value)?.user
                      .email ?? "",
                },
              }));
            }}
            options={usuarios}
            value={usuario.user.id}
            optionValue="id"
            optionLabel="name"
          />
        </div>
      ) : (
        <Input
          label="Usuário"
          value={
            usuarios.find((u) => u.id === usuario.user.id)?.name ??
            usuario.user.email
          }
          width="100%"
          disabled={!!itemToEdit}
        />
      )}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span>Máquina</span>
        <Dropdown
          onChange={(value) => {
            setUsuario((prev) => ({
              ...prev,
              function: { ...prev.function, id: value.value },
            }));
          }}
          options={maquinas}
          value={usuario.function.id}
          optionValue="id"
          optionLabel="name"
        />
      </div>
      {/* <div
        style={{
          gap: 10,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          marginTop: 10,
        }}
      >
        <Checkbox
          title="Obsoleto"
          checked={usuario.is_obsolete}
          onChange={(value) => handleInputChange("is_obsolete", value.checked)}
        />
        <span>Obsoleto</span>
      </div> */}
    </Dialog>
  );
};

export default MaquinasUsuariosDialog;
