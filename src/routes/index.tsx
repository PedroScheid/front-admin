import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Login, Register } from "../screens";
import { AuthProvider } from "../context";

const AppRoutes = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default AppRoutes;
