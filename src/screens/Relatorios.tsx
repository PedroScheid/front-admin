import "primereact/resources/themes/bootstrap4-dark-blue/theme.css";

import { useNavigate } from "react-router-dom";
import { NavBar } from "../components";
import { Chart } from "primereact/chart";
import { Card } from "primereact/card";
import { ProgressBar } from "primereact/progressbar";
import { useState, useEffect } from "react";

interface Course {
  id: number;
  title: string;
  completionDate: Date | null;
  expirationDate: Date;
}

interface User {
  id: number;
  name: string;
  courses: Course[];
}

const Relatorios = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const sampleUsers: User[] = [
      {
        id: 1,
        name: "User Teste",
        courses: [
          {
            id: 101,
            title: "React Basics",
            completionDate: new Date(),
            expirationDate: new Date(),
          },
          {
            id: 102,
            title: "Advanced TypeScript",
            completionDate: null,
            expirationDate: new Date(),
          },
        ],
      },
      {
        id: 2,
        name: "User Teste 2",
        courses: [
          {
            id: 101,
            title: "React Basics",
            completionDate: new Date(),
            expirationDate: new Date(),
          },
          {
            id: 102,
            title: "Advanced TypeScript",
            completionDate: null,
            expirationDate: new Date(),
          },
        ],
      },
      {
        id: 3,
        name: "User Teste 3",
        courses: [
          {
            id: 101,
            title: "React Basics",
            completionDate: new Date(),
            expirationDate: new Date(),
          },
          {
            id: 102,
            title: "Advanced TypeScript",
            completionDate: null,
            expirationDate: new Date(),
          },
        ],
      },
    ];
    setUsers(sampleUsers);
  }, []);

  const courseCompletionData = {
    labels: ["Competo", "Em Andamento", "Não Iniciados"],
    datasets: [
      {
        data: [5, 2, 3],
        backgroundColor: ["#66BB6A", "#FCE205", "#42A5F5"],
      },
    ],
  };

  const userProgressData = {
    labels: users.map((user) => user.name),
    datasets: [
      {
        label: "Taxa de conclusão",
        backgroundColor: "#42A5F5",
        data: users.map(
          (user) =>
            (user.courses.filter((course) => course.completionDate).length /
              user.courses.length) *
            100
        ),
      },
    ],
  };

  const courseExpirationData = {
    labels: users.map((user) => user.name),
    datasets: [
      {
        label: "Pertos de expirar",
        backgroundColor: "#FF6384",
        data: users.map(
          (user) =>
            user.courses.filter(
              (course) =>
                new Date(course.expirationDate).getTime() <
                new Date().getTime() + 7 * 24 * 60 * 60 * 1000
            ).length
        ),
      },
    ],
  };

  return (
    <div
      style={{
        backgroundColor: "#414650",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <NavBar />
      <div style={{ padding: "2em" }}>
        <div
          style={{
            display: "flex",
            height: "100%",
            flexWrap: "wrap",
          }}
        >
          <div style={{ padding: "10px", height: "100%" }}>
            <Card title="Cursos Completos" style={{ height: "100%" }}>
              <Chart type="doughnut" data={courseCompletionData} />
            </Card>
          </div>

          <div style={{ padding: "10px", height: "100%" }}>
            <Card title="Progresso do Usuário" style={{ height: "100%" }}>
              <Chart type="bar" data={userProgressData} />
            </Card>
          </div>

          <div style={{ padding: "10px", height: "100%" }}>
            <Card title="Cursos Prestes a Expirar" style={{ height: "100%" }}>
              <Chart
                type="bar"
                data={courseExpirationData}
                style={{ height: "100%" }}
              />
            </Card>
          </div>

          <div style={{ padding: "10px", height: "100%" }}>
            <Card
              title="Distribuição de Conclusão por Data"
              style={{ height: "100%" }}
            >
              <Chart
                type="line"
                data={{
                  labels: ["Jan", "Feb", "Mar", "Apr"],
                  datasets: [
                    {
                      label: "Cursos Completos",
                      data: [3, 4, 1, 5],
                      fill: false,
                      borderColor: "#42A5F5",
                    },
                  ],
                }}
              />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Relatorios;
