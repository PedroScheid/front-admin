import { useState } from "react";
import "../App.css";
import "primereact/resources/themes/bootstrap4-dark-blue/theme.css";
import { Input, Button, Dropdown } from "../components";
import { Gender, UserRole } from "../types";
import { genderOptions, userRoleOptions } from "../utils";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Register = () => {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [userRole, setUserRole] = useState(UserRole.NORMAL);
  const [gender, setGender] = useState(Gender.MASCULINO);
  const navigate = useNavigate();

  const onChangeUser = (value: string) => {
    setUser(value);
  };

  const onChangePassword = (value: string) => {
    setPassword(value);
  };

  const onChangeEmail = (value: string) => {
    setEmail(value);
  };

  const onChangeUserRole = (value: UserRole) => {
    setUserRole(value);
  };

  const onChangeGender = (value: Gender) => {
    setGender(value);
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error("Por favor, preencha o nome.");
      return;
    }

    if (!password) {
      toast.error("Por favor, preencha a senha.");
      return;
    }

    if (!email) {
      toast.error("Por favor, preencha o e-mail.");
      return;
    }

    const newUser = {
      nome: user,
      senha: password,
      email: email,
      tipo_usuario: userRole,
      genero: gender,
    };
    console.log("🚀 ~ handleSubmit ~ newUser:", newUser);

    try {
      navigate("/login");
      toast.success("Usuário cadastrado com sucesso!");
    } catch (error) {
      console.error("Erro na requisição:", error);
      toast.error("Erro na requisição");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Registro</h2>
        <Input
          label="Usuário"
          value={user}
          onChange={onChangeUser}
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
          label="E-mail"
          value={email}
          onChange={onChangeEmail}
          width="100%"
        />
        <Dropdown
          options={userRoleOptions}
          value={userRole}
          onChange={onChangeUserRole}
          label="Tipo de usuário"
          width="100%"
        />
        <Dropdown
          options={genderOptions}
          value={gender}
          onChange={onChangeGender}
          width="100%"
          label="Gênero"
        />
        <Button onClick={handleSubmit} width="100%">
          Cadastrar
        </Button>
      </div>
    </div>
  );
};

export default Register;
