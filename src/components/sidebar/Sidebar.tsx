import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, MenuItem } from "./styles";
import { LogoutButton } from "../common/Button";
import { useAuth } from "../../contexts/AuthContext";

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();

  const { signOut, user } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate("/auth/login");
  };

  return (
    <Container>
      <MenuItem onClick={() => navigate("/")}>Dashboard</MenuItem>
      <MenuItem onClick={() => navigate("/profile")}>Perfil</MenuItem>
      <MenuItem onClick={() => navigate("/settings")}>Configurações</MenuItem>

      {user && (
        <LogoutButton onClick={handleLogout}>Sair da Conta</LogoutButton>
      )}
    </Container>
  );
};
