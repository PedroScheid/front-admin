import { useState } from "react";
import "../App.css";
import "primereact/resources/themes/bootstrap4-dark-blue/theme.css";

import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button, Input } from "../components";

const Login = () => {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const onChangeUser = (value: string) => {
    setUser(value);
  };

  const onChangePassword = (value: string) => {
    setPassword(value);
  };

  const handleLogin = async () => {
    try {
      toast.success("Login bem-sucedido!");
      navigate("/");
    } catch (error) {
      console.error("Erro no login:", error);
      toast.error(`Usuário ou senha incorretos`);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Login</h2>
        <Input
          width="100%"
          label="E-mail"
          value={user}
          onChange={onChangeUser}
        />
        <Input
          width="100%"
          label="Senha"
          value={password}
          onChange={onChangePassword}
          type="password"
        />
        <Button onClick={handleLogin} width="100%">
          Entrar
        </Button>
        <p className="register-text">
          Não tem uma conta? <a href="/register">Cadastre-se</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
