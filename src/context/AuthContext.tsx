import {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
  useMemo,
} from "react";
import { UserRole } from "../types";

interface AuthContextType {
  isAuthenticated: boolean;
  userRole: UserRole;
  idUser: number;
  isGmailUser: boolean;
  login: (
    token: string,
    userRole: UserRole,
    userId: number,
    isGmailUser: boolean
  ) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<UserRole>(UserRole.NORMAL);
  const [idUser, setIdUser] = useState(0);
  const [isGmailUser, setIsGmailUser] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const storedUserRole = localStorage.getItem("userRole");
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
    if (storedUserRole) {
      setUserRole(parseInt(storedUserRole, 10));
    }
  }, []);

  const login = (
    token: string,
    userRole: UserRole,
    userId: number,
    isGmailUser: boolean
  ) => {
    localStorage.setItem("authToken", token);
    setIsAuthenticated(true);
    localStorage.setItem("userRole", userRole.toString());
    setUserRole(userRole);
    setIdUser(userId);
    setIsGmailUser(isGmailUser);
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    setIsAuthenticated(false);
    setUserRole(UserRole.NORMAL);
  };

  const memoizedUserRole = useMemo(() => userRole, [userRole]);
  const memoizedUserID = useMemo(() => idUser, [idUser]);
  const memoizedIsGmailUser = useMemo(() => isGmailUser, [isGmailUser]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        idUser: memoizedUserID,
        userRole: memoizedUserRole,
        isGmailUser: memoizedIsGmailUser,
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
