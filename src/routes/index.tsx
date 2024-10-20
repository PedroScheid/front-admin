import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {
  Estatisticas,
  Home,
  Login,
  Register,
  Relatorios,
  Treinamentos,
  Usuarios,
} from "../screens";
import { AuthProvider } from "../context";

const AppRoutes = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/treinamentos" element={<Treinamentos />} />
          <Route path="/estatisticas" element={<Estatisticas />} />
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/home" element={<Home />} />
          <Route path="/relatorios" element={<Relatorios />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default AppRoutes;
