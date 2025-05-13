import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "danger" | "success" | "google";
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  className = "",
  ...props
}) => {
  const variantClass =
    variant === "google"
      ? "btn btn-outline-primary d-flex align-items-center justify-content-center gap-2"
      : `btn btn-${variant}`;

  return (
    <button className={`${variantClass} ${className}`} {...props}>
      {children}
    </button>
  );
};
