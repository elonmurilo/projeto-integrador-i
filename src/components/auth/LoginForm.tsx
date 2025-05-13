import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../../config/supabase";

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError("");
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) throw signInError;
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Error logging in:", error);
      setError("Erro ao fazer login. Verifique suas credenciais.");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError("");
      const { error: signInError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (signInError) throw signInError;
    } catch (error) {
      console.error("Error logging in with Google:", error);
      setError("Erro ao fazer login com Google.");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
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

      <div className="d-grid gap-2 mb-3">
        <button type="submit" className="btn btn-primary">
          Entrar
        </button>
        <button
          type="button"
          className="btn btn-outline-danger"
          onClick={handleGoogleLogin}
        >
          Entrar com Google
        </button>
      </div>

      <div className="text-center">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            navigate("/auth/forgot-password");
          }}
          className="d-block"
        >
          Esqueceu sua senha?
        </a>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            navigate("/auth/register");
          }}
        >
          Não tem uma conta? Cadastre-se
        </a>
      </div>
    </form>
  );
};
