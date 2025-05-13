import React from "react";

interface ContainerProps {
  children: React.ReactNode;
}

export const Container: React.FC<ContainerProps> = ({ children }) => {
  return (
    <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center bg-light p-4">
      {children}
    </div>
  );
};

interface ButtonContainerProps {
  children: React.ReactNode;
}

export const ButtonContainer: React.FC<ButtonContainerProps> = ({ children }) => {
  return <div className="d-flex gap-3">{children}</div>;
};
