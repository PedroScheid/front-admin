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
    <div className="App">
      <span style={{ fontSize: 40, fontWeight: "bold", marginBottom: 30 }}>
        Registro
      </span>
      <Input label="Usuario" value={user} onChange={onChangeUser} />
      <Input
        label="Senha"
        value={password}
        onChange={onChangePassword}
        type="password"
      />
      <Input label="Email" value={email} onChange={onChangeEmail} />
      <Dropdown
        options={userRoleOptions}
        value={userRole}
        onChange={onChangeUserRole}
        label="Tipo de usuário"
      />
      <Dropdown
        options={genderOptions}
        value={gender}
        onChange={onChangeGender}
        label="Gênero"
      />
      <Button onClick={handleSubmit}>Cadastrar</Button>
    </div>
  );
};

export default Register;
