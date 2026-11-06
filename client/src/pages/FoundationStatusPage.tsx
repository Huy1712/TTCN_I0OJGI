import React, { useCallback, useEffect, useState } from "react";
import { brandConfig, formatVnd } from "../config/brand";
import { apiClient, ApiClientError } from "../lib/apiClient";
import { HealthCheckData } from "../types/api";

export const FoundationStatusPage: React.FC = () => {
  const [health, setHealth] = useState<HealthCheckData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const checkApiHealth = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<HealthCheckData>("/health");
      setHealth(response.data);
    } catch (err: unknown) {
      if (err instanceof ApiClientError) {
        setError(`${err.message} (Mã lỗi: ${err.code})`);
      } else {
        setError("Không thể kiểm tra trạng thái kết nối tới máy chủ API.");
      }
      setHealth(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void checkApiHealth();
  }, [checkApiHealth]);

  const paletteSwatches = [
    { name: "Kem nền (Cream)", hex: "#F7F1EA", varName: "--color-bg-cream" },
    { name: "Nude", hex: "#E8D4C9", varName: "--color-surface-nude" },
    { name: "Hồng phấn (Blush)", hex: "#E8B7B1", varName: "--color-accent-blush" },
    { name: "Rose Pink", hex: "#C78F91", varName: "--color-accent-rose-pink" },
    { name: "Rose Gold", hex: "#B98C68", varName: "--color-accent-rose-gold" },
    { name: "Nâu than (Charcoal)", hex: "#342A2A", varName: "--color-text-charcoal" },
    { name: "Trắng ấm (Warm White)", hex: "#FFFCF8", varName: "--color-surface-warm-white" },
  ];

  return (
    <section
      className="container-editorial"
      style={{ paddingTop: "var(--space-10)", paddingBottom: "var(--space-10)" }}
    >
      <div className="surface-card" style={{ marginBottom: "var(--space-8)" }}>
        <span className="eyebrow-label">Task 01 — Nền tảng kiến trúc</span>
        <h1
          style={{
            fontSize: "var(--text-display-hero)",
            marginTop: "var(--space-2)",
            marginBottom: "var(--space-3)",
          }}
        >
          {brandConfig.name}
        </h1>
        <p
          style={{
            fontSize: "var(--text-body-lg)",
            color: "var(--color-text-muted)",
            maxWidth: "62ch",
            marginBottom: "var(--space-5)",
          }}
        >
          {brandConfig.slogan} — Nền tảng Frontend (React + TypeScript + Vite),
          Backend (Express + Prisma) và PostgreSQL (Docker Compose) đã được khởi
          tạo theo chuẩn Nude Luxury &amp; Cinematic Editorial.
        </p>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "var(--space-4)",
            alignItems: "center",
          }}
        >
          <button
            type="button"
            onClick={() => void checkApiHealth()}
            className="btn-luxury btn-luxury--primary"
            disabled={loading}
          >
            {loading ? "Đang kiểm tra API..." : "Kiểm tra lại GET /api/health"}
          </button>
          <span
            style={{
              fontSize: "var(--text-body-sm)",
              color: "var(--color-text-subtle)",
            }}
          >
            Định dạng tiền tệ chuẩn: {formatVnd(890000)}
          </span>
        </div>
      </div>

      {/* Trạng thái kết nối Backend & PostgreSQL */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "var(--space-6)",
          marginBottom: "var(--space-8)",
        }}
      >
        <div className="surface-card">
          <span className="eyebrow-label">Trạng thái hệ thống</span>
          <h2
            style={{
              fontSize: "var(--text-heading-md)",
              marginTop: "var(--space-2)",
              marginBottom: "var(--space-4)",
            }}
          >
            Kết nối Backend &amp; PostgreSQL
          </h2>

          {loading && (
            <p style={{ color: "var(--color-text-muted)" }}>
              Đang kết nối tới endpoint <code>GET /api/health</code>...
            </p>
          )}

          {!loading && error && (
            <div
              role="alert"
              style={{
                padding: "var(--space-4)",
                borderRadius: "var(--radius-md)",
                backgroundColor: "var(--color-status-danger-bg)",
                color: "var(--color-status-danger)",
              }}
            >
              <p style={{ fontWeight: 600, marginBottom: "0.25rem" }}>
                Chưa kết nối được tới API Server
              </p>
              <p style={{ fontSize: "var(--text-body-sm)" }}>{error}</p>
            </div>
          )}

          {!loading && health && (
            <dl
              style={{
                display: "grid",
                gridTemplateColumns: "140px 1fr",
                rowGap: "0.6rem",
                fontSize: "var(--text-body-sm)",
              }}
            >
              <dt style={{ color: "var(--color-text-subtle)" }}>API Status:</dt>
              <dd style={{ fontWeight: 600, color: "var(--color-status-success)" }}>
                {health.status.toUpperCase()} ({health.environment})
              </dd>
              <dt style={{ color: "var(--color-text-subtle)" }}>Database:</dt>
              <dd style={{ fontWeight: 600 }}>
                {health.database.status} ({health.database.latencyMs}ms)
              </dd>
              <dt style={{ color: "var(--color-text-subtle)" }}>Request ID:</dt>
              <dd>
                <code>{health.requestId}</code>
              </dd>
              <dt style={{ color: "var(--color-text-subtle)" }}>Timestamp:</dt>
              <dd>{health.timestamp}</dd>
            </dl>
          )}
        </div>

        <div className="surface-card">
          <span className="eyebrow-label">Design Tokens (Mục IV.1)</span>
          <h2
            style={{
              fontSize: "var(--text-heading-md)",
              marginTop: "var(--space-2)",
              marginBottom: "var(--space-4)",
            }}
          >
            Bảng màu Nude Luxury
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(135px, 1fr))",
              gap: "var(--space-3)",
            }}
          >
            {paletteSwatches.map((swatch) => (
              <div
                key={swatch.varName}
                style={{
                  border: "1px solid var(--color-border-hairline)",
                  borderRadius: "var(--radius-md)",
                  padding: "var(--space-2)",
                  backgroundColor: "var(--color-surface-warm-white)",
                }}
              >
                <div
                  style={{
                    height: "36px",
                    borderRadius: "var(--radius-sm)",
                    backgroundColor: `var(${swatch.varName})`,
                    border: "1px solid var(--color-border-hairline)",
                    marginBottom: "0.4rem",
                  }}
                />
                <div style={{ fontSize: "0.78rem", fontWeight: 600 }}>
                  {swatch.name}
                </div>
                <div
                  style={{
                    fontSize: "0.72rem",
                    color: "var(--color-text-subtle)",
                  }}
                >
                  {swatch.hex}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
