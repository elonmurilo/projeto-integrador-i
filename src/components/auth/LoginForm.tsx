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
          //redirectTo: `${window.location.origin}/auth/callback`,
          redirectTo: window.location.origin,
        },
      });
      if (signInError) throw signInError;
    } catch (error) {
      console.error("Error logging in with Google:", error);
      setError("Erro ao fazer login com Google.");
    }
  };

  return (
    <form onSubmit={handleLogin} aria-label="Formulário de login">
      {error && (
        <div
          className="alert alert-danger"
          role="alert"
          aria-live="assertive"
        >
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
          aria-required="true"
          aria-label="Campo para digitar o e-mail de acesso"
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
          aria-required="true"
          aria-label="Campo para digitar a senha de acesso"
        />
      </div>

      <div className="d-grid gap-2 mb-3">
        <button
          type="submit"
          className="btn btn-primary"
          aria-label="Entrar com e-mail e senha"
        >
          Entrar
        </button>

        <button
          type="button"
          className="btn btn-outline-danger"
          onClick={handleGoogleLogin}
          aria-label="Entrar com conta Google"
        >
          Entrar com Google
        </button>
      </div>

      <div className="text-center">
        <a
          href="#"
          role="button"
          aria-label="Recuperar senha de acesso"
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
          role="button"
          aria-label="Cadastrar nova conta de usuário"
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
