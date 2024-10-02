import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Login } from "../screens";
import { AuthProvider } from "../context";

const AppRoutes = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default AppRoutes;
