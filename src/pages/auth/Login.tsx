import React from "react";
import { LoginForm } from "../../components/auth/LoginForm";

export const Login: React.FC = () => {
  return (
    <div className="container vh-100 d-flex align-items-center justify-content-center">
      <div className="card shadow p-4 w-100" style={{ maxWidth: "500px" }}>
        <h1 className="text-center mb-4">Login</h1>
        <LoginForm />
      </div>
    </div>
  );
};
