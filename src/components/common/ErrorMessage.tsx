import React from "react";

interface ErrorMessageProps {
  children: React.ReactNode;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ children }) => {
  return (
    <div className="alert alert-danger text-center mb-3" role="alert">
      {children}
    </div>
  );
};
