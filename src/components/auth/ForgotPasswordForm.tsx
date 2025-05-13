import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../config/supabase";
import { Form } from "../common/Form";
import { Input } from "../common/Input";
import { Button } from "../common/Button";
import { SuccessMessage } from "../common/SuccessMessage";
import { Link } from "../common/Link";

export const ForgotPasswordForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      if (error) throw error;
      setMessage("Verifique seu email para redefinir sua senha");
    } catch (error) {
      console.error("Error resetting password:", error);
      setMessage("Ocorreu um erro ao tentar redefinir sua senha");
    }
  };

  return (
    <Form onSubmit={handleResetPassword}>
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Button type="submit">Enviar Link de Redefinição</Button>
      {message && <SuccessMessage>{message}</SuccessMessage>}
      <Link onClick={() => navigate("/auth/login")}>Voltar para o login</Link>
    </Form>
  );
};
