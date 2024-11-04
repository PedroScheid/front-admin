import { useState } from "react";
import "../App.css";
import "primereact/resources/themes/bootstrap4-dark-blue/theme.css";

import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button, Input } from "../components";
import { BASE_URL } from "../server";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const onChangeEmail = (value: string) => {
    setEmail(value);
  };

  const onChangePassword = (value: string) => {
    setPassword(value);
  };

  const handleLogin = async () => {
    try {
      const user = {
        email: email,
        password: password,
      };

      const response = await axios.post(`${BASE_URL}/auth/token/`, user);
      console.log("🚀 ~ handleLogin ~ response:", response);
      toast.success("Login bem-sucedido!");
      navigate("/home");
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
          value={email}
          onChange={onChangeEmail}
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
