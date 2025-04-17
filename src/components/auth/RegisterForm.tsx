import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../config/supabase";
import { Button, GoogleButton } from "../common/Button";
import { Input } from "../common/Input";
import { Form } from "../common/Form";
import { Link } from "../common/Link";

export const RegisterForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("As senhas não coincidem");
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      alert("Verifique seu email para confirmar o cadastro");
      navigate("/");
    } catch (error) {
      console.error("Error registering:", error);
    }
  };

  const handleGoogleRegister = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
      });
      if (error) throw error;
      navigate("/");
    } catch (error) {
      console.error("Error registering with Google:", error);
    }
  };

  return (
    <Form onSubmit={handleRegister}>
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Input
        type="password"
        placeholder="Confirmar Senha"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <Button type="submit">Cadastrar</Button>
      <GoogleButton type="button" onClick={handleGoogleRegister}>
        Cadastrar com Google
      </GoogleButton>
      <Link onClick={() => navigate("/login")}>
        Já tem uma conta? Faça login
      </Link>
      <Link onClick={() => navigate("/")}>Voltar para a página inicial</Link>
    </Form>
  );
};
