import "primereact/resources/themes/bootstrap4-dark-blue/theme.css";

import { useNavigate } from "react-router-dom";
import { NavBar } from "../components";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        backgroundColor: "#414650",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <NavBar />
      <div style={{ padding: "2em" }}>
        <h1>Painel de Treinamentos</h1>
      </div>
    </div>
  );
};

export default Home;
