import React from "react";

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode;
}

export const Form: React.FC<FormProps> = ({ children, className = "", ...props }) => {
  return (
    <form
      className={`d-flex flex-column gap-3 p-4 mx-auto w-100 ${className}`}
      style={{ maxWidth: "400px" }}
      {...props}
    >
      {children}
    </form>
  );
};
