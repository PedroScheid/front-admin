import { toast } from "react-toastify";
import Button from "./Button";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context";
import { Menubar } from "primereact/menubar";
import { useMemo } from "react";
import { Splitter } from "primereact/splitter";

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const handleButtonClick = (navigateTo: string) => {
    navigate(navigateTo);
  };

  const handleLogoutClick = () => {
    toast.success("Deslogado com sucesso!");
    logout();
    navigate("/login");
  };

  const startItems = useMemo(
    () => (
      <div style={{ flexDirection: "row", display: "flex", gap: 15 }}>
        {/* <Button
          label="Relatórios"
          icon="pi pi-shield"
          onClick={() => handleButtonClick("/relatorios")}
          buttonType={
            location.pathname === "/relatorios" ? "secondary" : "primary"
          }
        />
        <Splitter /> */}
        <Button
          label="Cursos"
          icon="pi pi-chart-bar"
          onClick={() => handleButtonClick("/cursos")}
          buttonType={location.pathname === "/cursos" ? "secondary" : "primary"}
        />
        <Button
          label="Aulas"
          icon="pi pi-chart-bar"
          onClick={() => handleButtonClick("/aulas")}
          buttonType={location.pathname === "/aulas" ? "secondary" : "primary"}
        />
        <Button
          label="Máquinas de Usuários"
          icon="pi pi-chart-bar"
          onClick={() => handleButtonClick("/maquinas-usuarios")}
          buttonType={
            location.pathname === "/maquinas-usuarios" ? "secondary" : "primary"
          }
        />
        <Button
          label="Usuários"
          icon="pi pi-chart-bar"
          onClick={() => handleButtonClick("/usuarios")}
          buttonType={
            location.pathname === "/usuarios" ? "secondary" : "primary"
          }
        />
        <Splitter />
        <Button
          label="Setores"
          icon="pi pi-chart-bar"
          onClick={() => handleButtonClick("/setores")}
          buttonType={
            location.pathname === "/setores" ? "secondary" : "primary"
          }
        />
        <Button
          label="Linhas"
          icon="pi pi-chart-bar"
          onClick={() => handleButtonClick("/linhas")}
          buttonType={location.pathname === "/linhas" ? "secondary" : "primary"}
        />
        <Button
          label="Máquinas"
          icon="pi pi-chart-bar"
          onClick={() => handleButtonClick("/maquinas")}
          buttonType={
            location.pathname === "/maquinas" ? "secondary" : "primary"
          }
        />
      </div>
    ),
    [handleButtonClick, location.pathname]
  );

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
