import React, { forwardRef } from "react";

export interface FormFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  errorMessage?: string;
  helperText?: string;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ id, label, errorMessage, helperText, required, style, ...rest }, ref) => {
    const errorId = id ? `${id}-error` : undefined;
    const helperId = id ? `${id}-helper` : undefined;

    return (
      <div style={{ display: "grid", gap: "0.4rem", marginBottom: "1.15rem" }}>
        <label
          htmlFor={id}
          style={{
            fontSize: "var(--text-body-sm)",
            fontWeight: 600,
            color: "var(--color-text-charcoal)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
          }}
        >
          <span>
            {label}
            {required ? (
              <span
                aria-hidden="true"
                style={{ color: "var(--color-accent-rose-pink)", marginLeft: "0.25rem" }}
              >
                *
              </span>
            ) : null}
          </span>
        </label>

        <input
          id={id}
          ref={ref}
          required={required}
          aria-invalid={Boolean(errorMessage)}
          aria-describedby={
            errorMessage ? errorId : helperText ? helperId : undefined
          }
          style={{
            width: "100%",
            padding: "0.8rem 1rem",
            borderRadius: "var(--radius-md)",
            border: errorMessage
              ? "1px solid var(--color-status-danger)"
              : "1px solid var(--color-border-hairline)",
            backgroundColor: "var(--color-bg-cream)",
            color: "var(--color-text-charcoal)",
            fontSize: "var(--text-body-md)",
            transition: "border-color var(--duration-fast) var(--ease-editorial)",
            ...style,
          }}
          {...rest}
        />

        {helperText && !errorMessage ? (
          <p
            id={helperId}
            style={{
              fontSize: "var(--text-caption-xs)",
              color: "var(--color-text-subtle)",
            }}
          >
            {helperText}
          </p>
        ) : null}

        {errorMessage ? (
          <p
            id={errorId}
            role="alert"
            style={{
              fontSize: "var(--text-caption-xs)",
              fontWeight: 500,
              color: "var(--color-status-danger)",
            }}
          >
            {errorMessage}
          </p>
        ) : null}
      </div>
    );
  }
);

FormField.displayName = "FormField";
