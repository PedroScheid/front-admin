import { useState } from "react";
import "../App.css";
import "primereact/resources/themes/bootstrap4-dark-blue/theme.css";
import { Input, Button } from "../components";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { BASE_URL } from "../server";

const Register = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const onChangePassword = (value: string) => setPassword(value);
  const onChangeConfirmPassword = (value: string) => setConfirmPassword(value);
  const onChangeEmail = (value: string) => setEmail(value);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async () => {
    if (!password || !confirmPassword || !email) {
      toast.error("Todos os campos devem ser preenchidos.");
      return;
    }

    if (!validateEmail(email)) {
      toast.error("Por favor, insira um e-mail válido.");
      return;
    }

    if (password.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem.");
      return;
    }

    const newUser = {
      email: email,
      password1: password,
      password2: confirmPassword,
    };

    try {
      const response = await axios.post(`${BASE_URL}/auth/register/`, newUser);
      console.log("🚀 ~ handleSubmit ~ response:", response);
      toast.success("Usuário cadastrado com sucesso!");
      navigate("/login");
    } catch (error) {
      console.error("Erro na requisição:", error);
      toast.error("Erro ao cadastrar usuário");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Registro</h2>
        <Input
          label="E-mail"
          value={email}
          onChange={onChangeEmail}
          width="100%"
        />
        <Input
          label="Senha"
          value={password}
          onChange={onChangePassword}
          type="password"
          width="100%"
        />
        <Input
          label="Confirmar Senha"
          value={confirmPassword}
          onChange={onChangeConfirmPassword}
          type="password"
          width="100%"
        />

        <Button onClick={handleSubmit} width="100%">
          Cadastrar
        </Button>
      </div>
    </div>
  );
};

export default Register;
