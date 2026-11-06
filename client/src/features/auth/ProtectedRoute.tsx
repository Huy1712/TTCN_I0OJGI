import React from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { UserRole } from "./authApi";
import { useAuth } from "./AuthProvider";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  redirectTo = "/login",
}) => {
  const { user, status, isAuthenticated } = useAuth();
  const location = useLocation();

  if (status === "loading") {
    return (
      <section
        className="container-editorial"
        style={{ paddingTop: "var(--space-10)", paddingBottom: "var(--space-10)" }}
        aria-busy="true"
      >
        <div className="surface-card" style={{ textAlign: "center" }}>
          <span className="eyebrow-label">Xác thực phiên</span>
          <p
            style={{
              marginTop: "var(--space-2)",
              color: "var(--color-text-muted)",
            }}
          >
            Đang kiểm tra trạng thái phiên đăng nhập của bạn...
          </p>
        </div>
      </section>
    );
  }

  if (!isAuthenticated || !user) {
    const returnUrl = `${location.pathname}${location.search}`;
    return (
      <Navigate
        to={redirectTo}
        replace
        state={{ from: returnUrl }}
      />
    );
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return (
      <section
        className="container-editorial"
        style={{ paddingTop: "var(--space-10)", paddingBottom: "var(--space-10)" }}
      >
        <div
          className="surface-card"
          role="alert"
          style={{ maxWidth: "620px", margin: "0 auto" }}
        >
          <span className="eyebrow-label">403 — Giới hạn quyền truy cập</span>
          <h1
            style={{
              fontSize: "var(--text-heading-lg)",
              marginTop: "var(--space-2)",
              marginBottom: "var(--space-3)",
            }}
          >
            Khu vực dành riêng cho Quản trị viên
          </h1>
          <p
            style={{
              color: "var(--color-text-muted)",
              marginBottom: "var(--space-5)",
            }}
          >
            Tài khoản hiện tại của bạn ({user.email}) có vai trò{" "}
            <strong>{user.role}</strong> nên không được phép truy cập vào phân hệ
            quản trị vận hành.
          </p>
          <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}>
            <Link to="/" className="btn-luxury btn-luxury--primary">
              Về Trang chủ
            </Link>
            <Link to="/account" className="btn-luxury btn-luxury--outline">
              Khu vực Tài khoản của tôi
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return <>{children}</>;
};
