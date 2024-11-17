import axios from "axios";
import {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
  useCallback,
} from "react";
import { BASE_URL } from "../server";

interface AuthContextType {
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  login: (token: string, rToken: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  console.log("🚀 ~ AuthProvider ~ accessToken:", accessToken);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const rToken = localStorage.getItem("refreshToken");
    setAccessToken(token);
    setRefreshToken(rToken);
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const login = (token: string, rToken: string) => {
    localStorage.setItem("authToken", token);
    localStorage.setItem("refreshToken", rToken);
    setIsAuthenticated(true);
    setAccessToken(token);
    setRefreshToken(rToken);
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    setIsAuthenticated(false);
    setAccessToken(null);
    setRefreshToken(null);
  };

  const verifyAccessToken = useCallback(async () => {
    if (!accessToken) return false;

    try {
      const response = await axios.post(
        `${BASE_URL}/auth/token/verify/`,
        { token: accessToken },
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("🚀 ~ verifyAccessToken ~ response:", response);
      return response.status === 200;
    } catch (error) {
      console.warn("Access token verification failed:", error);
      return false;
    }
  }, [accessToken]);

  const refreshAccessToken = useCallback(async () => {
    if (!refreshToken) return;

    try {
      const response = await axios.post(
        `${BASE_URL}/auth/token/refresh/`,
        { refresh: refreshToken },
        { headers: { "Content-Type": "application/json" } }
      );

      const newAccessToken = response.data.access;
      setAccessToken(newAccessToken);
      localStorage.setItem("authToken", newAccessToken);
    } catch (error) {
      console.error("Error refreshing access token:", error);
      logout();
    }
  }, [refreshToken]);

  useEffect(() => {
    const interval = setInterval(async () => {
      const isTokenValid = await verifyAccessToken();

      if (!isTokenValid) {
        await refreshAccessToken();
      }
    }, 1000 * 60);

    return () => clearInterval(interval);
  }, [verifyAccessToken, refreshAccessToken]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        accessToken,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
