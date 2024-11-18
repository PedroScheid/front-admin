import "./App.css";
import "primereact/resources/themes/bootstrap4-dark-blue/theme.css";
import AppRoutes from "./routes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; // Importa React Query
import { ConfirmDialog } from "primereact/confirmdialog";

const queryClient = new QueryClient(); // Inicializa o QueryClient

const App = () => {
  return (
    <AuthProvider>
      <ConfirmDialog />
      <QueryClientProvider client={queryClient}>
        <AppRoutes />
        <ToastContainer />
      </QueryClientProvider>
    </AuthProvider>
  );
};

export default App;
