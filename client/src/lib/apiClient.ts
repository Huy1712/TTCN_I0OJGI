import { ApiErrorPayload, ApiSuccessResponse } from "../types/api";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "/api").replace(
  /\/+$/,
  ""
);

let csrfTokenCache: string | null = null;

export function setCsrfToken(token: string | null): void {
  csrfTokenCache = token;
}

export class ApiClientError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details: unknown;
  public readonly requestId: string;

  constructor(
    statusCode: number,
    code: string,
    message: string,
    details: unknown = null,
    requestId = "client-unknown-request-id"
  ) {
    super(message);
    this.name = "ApiClientError";
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.requestId = requestId;
  }
}

export interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiSuccessResponse<T>> {
  const normalizedPath = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${API_BASE_URL}${normalizedPath}`;

  const headers = new Headers(options.headers || {});
  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }

  const isFormData =
    typeof FormData !== "undefined" && options.body instanceof FormData;

  if (options.body !== undefined && !isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (csrfTokenCache && !headers.has("X-CSRF-Token")) {
    headers.set("X-CSRF-Token", csrfTokenCache);
  }

  let response: Response;
  try {
    response = await fetch(url, {
      ...options,
      headers,
      credentials: "include",
      body:
        options.body === undefined
          ? undefined
          : isFormData
          ? (options.body as FormData)
          : JSON.stringify(options.body),
    });
  } catch (networkError: unknown) {
    throw new ApiClientError(
      0,
      "NETWORK_ERROR",
      networkError instanceof Error
        ? `Không thể kết nối tới máy chủ API (${networkError.message})`
        : "Không thể kết nối tới máy chủ API"
    );
  }

  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const payload = isJson ? await response.json() : null;

  if (!response.ok) {
    const errPayload = payload as any | null;
    
    // Lấy message trực tiếp từ root payload (ví dụ: payload.message) hoặc từ đối tượng lỗi
    const errorMessage = 
      errPayload?.message || 
      errPayload?.error?.message || 
      `Yêu cầu thất bại với mã trạng thái ${response.status}`;

    // Lấy chính xác mã lỗi (ví dụ: "EMAIL_ALREADY_EXISTS")
    const errorCode = 
      typeof errPayload?.error === "string" 
        ? errPayload.error 
        : errPayload?.error?.code || `HTTP_${response.status}`;

    throw new ApiClientError(
      response.status,
      errorCode,
      errorMessage,
      errPayload?.error?.details ?? errPayload?.data ?? null,
      errPayload?.error?.requestId || response.headers.get("X-Request-Id") || "unknown"
    );
  }

  return payload as ApiSuccessResponse<T>;
}

export const apiClient = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    apiRequest<T>(endpoint, { ...options, method: "GET" }),
  post: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    apiRequest<T>(endpoint, { ...options, method: "POST", body }),
  patch: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    apiRequest<T>(endpoint, { ...options, method: "PATCH", body }),
  delete: <T>(endpoint: string, options?: RequestOptions) =>
    apiRequest<T>(endpoint, { ...options, method: "DELETE" }),
};