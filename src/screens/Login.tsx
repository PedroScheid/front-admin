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
    <div className="App">
      <span style={{ fontSize: 40, fontWeight: "bold", marginBottom: 30 }}>
        Login
      </span>
      <Input label="E-mail" value={user} onChange={onChangeUser} />
      <Input
        label="Senha"
        value={password}
        onChange={onChangePassword}
        type="password"
      />
      <Button onClick={handleLogin} width="200px">
        Entrar
      </Button>
      <p>
        Não tem uma conta? <a href="/register">Cadastre-se</a>
      </p>
    </div>
  );
};

export default Login;
