import React from "react";

interface TitleProps {
  children: React.ReactNode;
}

export const Title: React.FC<TitleProps> = ({ children }) => {
  return (
    <h1 className="display-5 text-dark text-center mb-4">
      {children}
    </h1>
  );
};
