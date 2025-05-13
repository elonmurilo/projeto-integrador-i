import React from "react";

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode;
}

export const Link: React.FC<LinkProps> = ({ children, className = "", ...props }) => {
  return (
    <a
      className={`text-primary text-decoration-none text-center d-block ${className}`}
      {...props}
    >
      {children}
    </a>
  );
};
