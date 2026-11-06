import { apiClient, setCsrfToken } from "../../lib/apiClient";

export type UserRole = "CUSTOMER" | "ADMIN";

export interface AuthUser {
  id: number; // Số ID tự tăng từ Prisma
  fullName: string;
  email: string;
  phone: string | null;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
  phone?: string | null;
}

export interface LoginPayload {
  email: string;
  password: string;
}

// Cấu trúc chuẩn khớp với ApiResponseWrapper từ Backend
interface ApiResponseWrapper<T> {
  success: boolean;
  message: string;
  data: T;
  error: string | null;
}

export interface AuthSessionData {
  user: AuthUser;
  csrfToken: string;
}

export interface CsrfTokenData {
  csrfToken: string;
}

export const authApi = {
  async fetchCsrfToken(): Promise<string> {
    const response = await apiClient.get<ApiResponseWrapper<CsrfTokenData>>("/auth/csrf-token");
    const token = response.data.csrfToken;
    setCsrfToken(token);
    return token;
  },

  async register(payload: RegisterPayload): Promise<AuthUser> {
    const response = await apiClient.post<ApiResponseWrapper<AuthSessionData>>(
      "/auth/register",
      payload
    );
    const sessionData = response.data;
    if (sessionData?.csrfToken) {
      setCsrfToken(sessionData.csrfToken);
    }
    return sessionData.user;
  },

  async login(payload: LoginPayload): Promise<AuthUser> {
    const response = await apiClient.post<ApiResponseWrapper<AuthSessionData>>(
      "/auth/login",
      payload
    );
    const sessionData = response.data;
    if (sessionData?.csrfToken) {
      setCsrfToken(sessionData.csrfToken);
    }
    return sessionData.user;
  },

  async logout(): Promise<void> {
    await apiClient.post("/auth/logout");
    setCsrfToken(null);
  },

  async getMe(): Promise<AuthUser> {
    const response = await apiClient.get<ApiResponseWrapper<AuthSessionData>>("/auth/me");
    const sessionData = response.data;
    if (sessionData?.csrfToken) {
      setCsrfToken(sessionData.csrfToken);
    }
    return sessionData.user;
  },
};