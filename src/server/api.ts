import axios from "axios";
export const BASE_URL = "https://webinar-backend-nine.vercel.app/api";

const api = axios.create({
  baseURL: BASE_URL,
});

// Função para verificar o token de acesso
const verifyAccessToken = async (accessToken: string): Promise<boolean> => {
  if (!accessToken) return false;

  try {
    const response = await axios.post(
      `${BASE_URL}/auth/token/verify/`,
      { token: accessToken },
      { headers: { "Content-Type": "application/json" } }
    );

    return response.status === 200;
  } catch (error) {
    console.warn("Access token verification failed:", error);
    return false;
  }
};

// Função para atualizar o token de acesso
const refreshAccessToken = async (
  refreshToken: string
): Promise<string | null> => {
  if (!refreshToken) return null;

  try {
    const response = await axios.post(
      `${BASE_URL}/auth/token/refresh/`,
      { refresh: refreshToken },
      { headers: { "Content-Type": "application/json" } }
    );

    const newAccessToken = response.data.access;
    localStorage.setItem("authToken", newAccessToken);
    return newAccessToken;
  } catch (error) {
    console.error("Error refreshing access token:", error);
    return null;
  }
};

// Interceptor para requisições
api.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem("authToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (accessToken) {
      const isValid = await verifyAccessToken(accessToken);

      if (!isValid && refreshToken) {
        const newAccessToken = await refreshAccessToken(refreshToken);

        if (newAccessToken) {
          // Atualiza o token no cabeçalho da requisição
          config.headers["Authorization"] = `Bearer ${newAccessToken}`;
        } else {
          // Se não conseguir atualizar, redirecione para o logout
          console.warn("Unable to refresh token. Logging out...");
          // Aqui você pode chamar sua função de logout
        }
      } else if (isValid) {
        config.headers["Authorization"] = `Bearer ${accessToken}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Exportando a instância do Axios com o interceptor
export default api;
