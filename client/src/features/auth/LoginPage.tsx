import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import { FormField } from "../../components/ui/FormField";
import { brandConfig } from "../../config/brand";
import { ApiClientError } from "../../lib/apiClient";
import { useAuth } from "./AuthProvider";

const loginFormSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập địa chỉ email")
    .email("Địa chỉ email không hợp lệ"),
  password: z
    .string()
    .min(1, "Vui lòng nhập mật khẩu"),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

interface LocationState {
  from?: string;
}

export const LoginPage: React.FC = () => {
  const { login, isAuthenticated, user, status } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as LocationState | null) ?? null;

  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Đợi cho AuthProvider load xong status ('loading' -> 'authenticated'/'unauthenticated')
  // Chỉ tự động redirect khi thực sự đã đăng nhập TỪ TRƯỚC và không phải đang tự Submit form
  if (status !== "loading" && isAuthenticated && user && !isSubmitting) {
    const defaultTarget =
      state?.from || (user.role === "ADMIN" ? "/admin" : "/account");
    return <Navigate to={defaultTarget} replace />;
  }

  const onSubmit = async (values: LoginFormValues): Promise<void> => {
    setServerError(null);
    try {
      // Gọi API Đăng Nhập
      const loggedInUser = await login({
        email: values.email.trim().toLowerCase(),
        password: values.password,
      });

      // Nếu API thành công -> Mới cho phép chuyển hướng
      if (loggedInUser) {
        const redirectTarget =
          state?.from ||
          (loggedInUser.role === "ADMIN" ? "/admin" : "/account");
        navigate(redirectTarget, { replace: true });
      }
    } catch (err: any) {
      // Bắt lỗi từ Backend/Database trả về (ví dụ INVALID_CREDENTIALS)
      if (err instanceof ApiClientError) {
        switch (err.code) {
          case "INVALID_CREDENTIALS":
          case "UNAUTHORIZED":
            setServerError("Email hoặc mật khẩu không chính xác.");
            break;
          case "USER_NOT_FOUND":
            setServerError("Tài khoản này không tồn tại trong hệ thống.");
            break;
          default:
            setServerError(err.message || "Không thể đăng nhập lúc này.");
        }
      } else {
        setServerError(err?.message || "Không thể đăng nhập lúc này. Vui lòng thử lại sau.");
      }
    }
  };

  return (
    <section
      className="container-editorial"
      style={{
        paddingTop: "var(--space-10)",
        paddingBottom: "var(--space-10)",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        className="surface-card"
        style={{ width: "100%", maxWidth: "480px", padding: "var(--space-8)" }}
      >
        <span className="eyebrow-label">{brandConfig.name} — Atelier Access</span>
        <h1
          style={{
            fontSize: "var(--text-heading-lg)",
            marginTop: "var(--space-2)",
            marginBottom: "var(--space-2)",
          }}
        >
          Đăng nhập tài khoản
        </h1>
        <p
          style={{
            fontSize: "var(--text-body-sm)",
            color: "var(--color-text-muted)",
            marginBottom: "var(--space-6)",
          }}
        >
          Đăng nhập để quản lý giỏ hàng, gửi yêu cầu thiết kế nails riêng và theo
          dõi đơn hàng của bạn.
        </p>

        {serverError ? (
          <div
            role="alert"
            style={{
              padding: "var(--space-3) var(--space-4)",
              marginBottom: "var(--space-5)",
              borderRadius: "var(--radius-md)",
              backgroundColor: "var(--color-status-danger-bg)",
              color: "var(--color-status-danger)",
              fontSize: "var(--text-body-sm)",
            }}
          >
            {serverError}
          </div>
        ) : null}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <FormField
            id="login-email"
            type="email"
            label="Địa chỉ Email"
            placeholder="you@example.com"
            autoComplete="email"
            required
            errorMessage={errors.email?.message}
            {...register("email")}
          />

          <FormField
            id="login-password"
            type="password"
            label="Mật khẩu"
            placeholder="Nhập mật khẩu của bạn"
            autoComplete="current-password"
            required
            errorMessage={errors.password?.message}
            {...register("password")}
          />

          <button
            type="submit"
            className="btn-luxury btn-luxury--primary"
            disabled={isSubmitting}
            style={{ width: "100%", marginTop: "var(--space-2)" }}
          >
            {isSubmitting ? "Đang xác thực..." : "Đăng nhập"}
          </button>
        </form>

        <div
          style={{
            marginTop: "var(--space-6)",
            paddingTop: "var(--space-4)",
            borderTop: "1px solid var(--color-border-hairline)",
            textAlign: "center",
            fontSize: "var(--text-body-sm)",
            color: "var(--color-text-muted)",
          }}
        >
          Chưa có tài khoản tại {brandConfig.name}?{" "}
          <Link
            to="/register"
            state={state}
            style={{
              fontWeight: 600,
              color: "var(--color-accent-rose-gold)",
              textDecoration: "underline",
            }}
          >
            Đăng ký ngay
          </Link>
        </div>
      </div>
    </section>
  );
};