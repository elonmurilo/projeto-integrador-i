import React from "react";

interface SuccessMessageProps {
  children: React.ReactNode;
}

export const SuccessMessage: React.FC<SuccessMessageProps> = ({ children }) => {
  return (
    <div className="alert alert-success text-center" role="alert">
      {children}
    </div>
  );
};
