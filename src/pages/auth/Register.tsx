import React, { useState } from "react";
import { supabase } from "../../config/supabase";
import { useNavigate } from "react-router-dom";

export const Register: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError("");
      setSuccess("");
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      setSuccess("Cadastro realizado com sucesso. Verifique seu e-mail.");
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      setError("Erro ao realizar cadastro. Tente novamente.");
    }
  };

  return (
    <div className="container vh-100 d-flex align-items-center justify-content-center">
      <div className="card shadow p-4 w-100" style={{ maxWidth: "500px" }}>
        <h2 className="text-center mb-4">Criar Conta</h2>
        <form onSubmit={handleRegister}>
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          {success && (
            <div className="alert alert-success" role="alert">
              {success}
            </div>
          )}

          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              E-mail
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Senha
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="d-grid mb-3">
            <button type="submit" className="btn btn-primary">
              Cadastrar
            </button>
          </div>

          <div className="text-center">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate("/auth/login");
              }}
            >
              Já possui uma conta? Faça login
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};
