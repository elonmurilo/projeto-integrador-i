import React from "react";

interface SubtitleProps {
  children: React.ReactNode;
}

export const Subtitle: React.FC<SubtitleProps> = ({ children }) => {
  return (
    <p className="text-muted text-center mb-4" style={{ maxWidth: 600 }}>
      {children}
    </p>
  );
};
