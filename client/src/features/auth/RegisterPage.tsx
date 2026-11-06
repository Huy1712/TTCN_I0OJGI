import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import { FormField } from "../../components/ui/FormField";
import { brandConfig } from "../../config/brand";
import { ApiClientError } from "../../lib/apiClient";
import { useAuth } from "./AuthProvider";

const vietnamOrIntlPhoneRegex = /^(\+?84|0)[35789][0-9]{8}$/;

const registerFormSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, "Họ và tên phải có ít nhất 2 ký tự")
      .max(100, "Họ và tên không được vượt quá 100 ký tự"),
    email: z
      .string()
      .trim()
      .min(1, "Vui lòng nhập địa chỉ email")
      .email("Địa chỉ email không hợp lệ"),
    phone: z
      .string()
      .transform((val) => val.trim())
      .pipe(
        z
          .string()
          .refine(
            (val) => val === "" || vietnamOrIntlPhoneRegex.test(val),
            "Số điện thoại không hợp lệ (ví dụ: 0901234567)"
          )
      )
      .optional(),
    password: z
      .string()
      .min(8, "Mật khẩu phải có tối thiểu 8 ký tự")
      .max(128, "Mật khẩu không được vượt quá 128 ký tự")
      .regex(/[A-Z]/, "Mật khẩu phải chứa ít nhất 1 chữ cái viết hoa")
      .regex(/[a-z]/, "Mật khẩu phải chứa ít nhất 1 chữ cái viết thường")
      .regex(/[0-9]/, "Mật khẩu phải chứa ít nhất 1 chữ số"),
    confirmPassword: z.string().min(1, "Vui lòng xác nhận lại mật khẩu"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Mật khẩu xác nhận không khớp",
  });

type RegisterFormValues = z.infer<typeof registerFormSchema>;

interface LocationState {
  from?: string;
}

export const RegisterPage: React.FC = () => {
  const { register: registerCustomerAccount, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as LocationState | null) ?? null;

  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  if (isAuthenticated) {
    return <Navigate to={state?.from || "/account"} replace />;
  }

  const onSubmit = async (values: RegisterFormValues): Promise<void> => {
    setServerError(null);
    try {
      const cleanPhone = values.phone ? values.phone.trim() : "";
      
      await registerCustomerAccount({
        fullName: values.fullName.trim(),
        email: values.email.trim().toLowerCase(),
        password: values.password,
        phone: cleanPhone.length > 0 ? cleanPhone : null,
      });

      navigate(state?.from || "/account", { replace: true });
    } catch (err: unknown) {
      if (err instanceof ApiClientError) {
        switch (err.code) {
          case "EMAIL_ALREADY_EXISTS":
            setServerError("Địa chỉ email này đã được sử dụng bởi tài khoản khác. Vui lòng chọn email khác.");
            break;
          case "INVALID_CREDENTIALS":
            setServerError("Thông tin đăng nhập không chính xác.");
            break;
          case "VALIDATION_ERROR":
            setServerError(err.message || "Dữ liệu nhập vào không hợp lệ. Vui lòng kiểm tra lại.");
            break;
          default:
            setServerError(err.message || "Đã xảy ra lỗi trong quá trình xử lý yêu cầu.");
        }
      } else if (err instanceof Error) {
        setServerError(err.message);
      } else {
        setServerError("Không thể hoàn tất đăng ký lúc này. Vui lòng thử lại sau.");
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
        style={{ width: "100%", maxWidth: "520px", padding: "var(--space-8)" }}
      >
        <span className="eyebrow-label">{brandConfig.name} — Member Atelier</span>
        <h1
          style={{
            fontSize: "var(--text-heading-lg)",
            marginTop: "var(--space-2)",
            marginBottom: "var(--space-2)",
          }}
        >
          Tạo tài khoản Khách hàng
        </h1>
        <p
          style={{
            fontSize: "var(--text-body-sm)",
            color: "var(--color-text-muted)",
            marginBottom: "var(--space-6)",
          }}
        >
          Trở thành thành viên của {brandConfig.name} để lưu thông tin đo móng,
          đặt thiết kế riêng theo yêu cầu và theo dõi lịch sử đơn hàng.
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
            id="register-fullName"
            type="text"
            label="Họ và tên"
            placeholder="Nguyễn Minh Anh"
            autoComplete="name"
            required
            errorMessage={errors.fullName?.message}
            {...register("fullName")}
          />

          <FormField
            id="register-email"
            type="email"
            label="Địa chỉ Email"
            placeholder="minhanh@example.com"
            autoComplete="email"
            required
            errorMessage={errors.email?.message}
            {...register("email")}
          />

          <FormField
            id="register-phone"
            type="tel"
            label="Số điện thoại (Tùy chọn)"
            placeholder="0901234567"
            autoComplete="tel"
            helperText="Dùng để liên hệ xác nhận đơn hàng hoặc trao đổi mẫu thiết kế riêng."
            errorMessage={errors.phone?.message}
            {...register("phone")}
          />

          <FormField
            id="register-password"
            type="password"
            label="Mật khẩu"
            placeholder="Tối thiểu 8 ký tự (gồm chữ hoa, chữ thường và số)"
            autoComplete="new-password"
            required
            errorMessage={errors.password?.message}
            {...register("password")}
          />

          <FormField
            id="register-confirmPassword"
            type="password"
            label="Xác nhận mật khẩu"
            placeholder="Nhập lại mật khẩu"
            autoComplete="new-password"
            required
            errorMessage={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />

          <button
            type="submit"
            className="btn-luxury btn-luxury--primary"
            disabled={isSubmitting}
            style={{ width: "100%", marginTop: "var(--space-2)" }}
          >
            {isSubmitting ? "Đang khởi tạo tài khoản..." : "Đăng ký tài khoản"}
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
          Đã có tài khoản?{" "}
          <Link
            to="/login"
            state={state}
            style={{
              fontWeight: 600,
              color: "var(--color-accent-rose-gold)",
              textDecoration: "underline",
            }}
          >
            Đăng nhập tại đây
          </Link>
        </div>
      </div>
    </section>
  );
};
