import { toast } from "react-toastify";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context";
import { Menubar } from "primereact/menubar";

const NavBar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleUsuariosClick = () => {
    navigate("/usuarios");
  };

  const handleTreinamentosClick = () => {
    navigate("/treinamentos");
  };

  const handleRelatoriosClick = () => {
    navigate("/relatorios");
  };

  const handleEstatisticasClick = () => {
    navigate("/estatisticas");
  };

  const startItems = (
    <div style={{ flexDirection: "row", display: "flex", gap: 15 }}>
      <Button
        label="Usuários"
        icon="pi pi-user"
        onClick={handleUsuariosClick}
      />
      <Button
        label="Treinamentos"
        icon="pi pi-chart-bar"
        onClick={handleTreinamentosClick}
      />
      <Button
        label="Relatórios"
        icon="pi pi-shield"
        onClick={handleRelatoriosClick}
      />
      <Button
        label="Estatísticas"
        icon="pi pi-shield"
        onClick={handleEstatisticasClick}
      />
    </div>
  );

  const handleLogoutClick = () => {
    toast.success("Deslogado com sucesso!");
    logout();
    navigate("/login");
  };

  const endItems = (
    <Button
      label="Desconectar"
      icon="pi pi-sign-out"
      onClick={handleLogoutClick}
      buttonType="secondary"
    />
  );

  return (
    <Menubar start={startItems} end={endItems} style={{ width: "100vw" }} />
  );
};

export default NavBar;
