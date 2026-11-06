import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  authApi,
  AuthUser,
  LoginPayload,
  RegisterPayload,
} from "./authApi";

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

export interface AuthContextValue {
  user: AuthUser | null;
  status: AuthStatus;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (payload: LoginPayload) => Promise<AuthUser>;
  register: (payload: RegisterPayload) => Promise<AuthUser>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  const refreshSession = useCallback(async () => {
    try {
      const currentUser = await authApi.getMe();
      setUser(currentUser);
      setStatus("authenticated");
    } catch {
      setUser(null);
      setStatus("unauthenticated");
      try {
        await authApi.fetchCsrfToken();
      } catch {
        // Bỏ qua nếu server chưa phản hồi khi khởi động
      }
    }
  }, []);

  useEffect(() => {
    void refreshSession();
  }, [refreshSession]);

  const login = useCallback(async (payload: LoginPayload): Promise<AuthUser> => {
    try {
      const loggedInUser = await authApi.login(payload);
      setUser(loggedInUser);
      setStatus("authenticated");
      return loggedInUser;
    } catch (error) {
      setUser(null);
      setStatus("unauthenticated");
      throw error; 
    }
  }, []);

  const register = useCallback(
    async (payload: RegisterPayload): Promise<AuthUser> => {
      const registeredUser = await authApi.register(payload);
      setUser(registeredUser);
      setStatus("authenticated");
      return registeredUser;
    },
    []
  );

  const logout = useCallback(async (): Promise<void> => {
    try {
      await authApi.logout();
    } finally {
      setUser(null);
      setStatus("unauthenticated");
    }
  }, []);

  const contextValue = useMemo<AuthContextValue>(
    () => ({
      user,
      status,
      isAuthenticated: status === "authenticated" && user !== null,
      isAdmin: status === "authenticated" && user?.role === "ADMIN",
      login,
      register,
      logout,
      refreshSession,
    }),
    [user, status, login, register, logout, refreshSession]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth phải được sử dụng bên trong <AuthProvider>.");
  }
  return context;
}
