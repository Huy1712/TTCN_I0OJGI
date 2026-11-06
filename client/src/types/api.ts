/**
 * Hợp đồng kiểu dữ liệu API chuẩn hóa theo mục VI.
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiSuccessResponse<T> {
  data: T;
  meta?: PaginationMeta;
}

export interface ApiErrorPayload {
  error: {
    code: string;
    message: string;
    details: unknown | null;
    requestId: string;
  };
}

export interface HealthCheckData {
  status: "ok" | "degraded";
  service: string;
  environment: string;
  timestamp: string;
  uptimeSeconds: number;
  requestId: string;
  database: {
    status: "connected" | "disconnected";
    latencyMs: number;
    error?: string;
  };
}
