import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {
  Estatisticas,
  Home,
  Login,
  Register,
  Relatorios,
  Cursos,
  MaquinasUsuarios,
  Usuarios,
} from "../screens";
import { AuthProvider } from "../context";
import Setores from "../screens/Setores";
import Funcoes from "../screens/Funcoes";
import SubSetores from "../screens/SubSetores";

const AppRoutes = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/cursos" element={<Cursos />} />
          <Route path="/estatisticas" element={<Estatisticas />} />
          <Route path="/maquinas-usuarios" element={<MaquinasUsuarios />} />
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/home" element={<Home />} />
          <Route path="/relatorios" element={<Relatorios />} />
          <Route path="/setores" element={<Setores />} />
          <Route path="/maquinas" element={<Funcoes />} />
          <Route path="/linhas" element={<SubSetores />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default AppRoutes;
