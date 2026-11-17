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

export interface ShippingAddress {
  id: number;
  recipientName: string;
  phone: string;
  province: string;
  ward: string;
  addressLine: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ShippingAddressInput = Omit<
  ShippingAddress,
  "id" | "createdAt" | "updatedAt"
>;

export interface AuthSessionData {
  user: AuthUser;
  csrfToken: string;
}

export interface CsrfTokenData {
  csrfToken: string;
}

export const authApi = {
  async fetchCsrfToken(): Promise<string> {
    const response = await apiClient.get<CsrfTokenData>("/auth/csrf-token");
    const token = response.data.csrfToken;
    setCsrfToken(token);
    return token;
  },

  async register(payload: RegisterPayload): Promise<AuthUser> {
    const response = await apiClient.post<AuthSessionData>(
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
    const response = await apiClient.post<AuthSessionData>(
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
    const response = await apiClient.get<AuthSessionData>("/auth/me");
    const sessionData = response.data;
    if (sessionData?.csrfToken) {
      setCsrfToken(sessionData.csrfToken);
    }
    return sessionData.user;
  },

  async updateProfile(
    payload: Pick<AuthUser, "fullName" | "phone">
  ): Promise<AuthUser> {
    const response = await apiClient.patch<AuthUser>(
      "/account/profile",
      payload
    );
    return response.data;
  },

  async getAddresses(): Promise<ShippingAddress[]> {
    const response = await apiClient.get<ShippingAddress[]>(
      "/account/addresses"
    );
    return response.data;
  },

  async createAddress(payload: ShippingAddressInput): Promise<ShippingAddress> {
    const response = await apiClient.post<ShippingAddress>(
      "/account/addresses",
      payload
    );
    return response.data;
  },

  async updateAddress(
    addressId: number,
    payload: Partial<ShippingAddressInput>
  ): Promise<ShippingAddress> {
    const response = await apiClient.patch<ShippingAddress>(
      `/account/addresses/${addressId}`,
      payload
    );
    return response.data;
  },

  async deleteAddress(addressId: number): Promise<void> {
    await apiClient.delete<null>(`/account/addresses/${addressId}`);
  },
};