import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Container } from "../home/Layout";
import { Title } from "../../components/common/Title";
import { Subtitle } from "../../components/common/Subtitle";
import { Sidebar } from "../../components/sidebar/Sidebar";

export const Profile: React.FC = () => {
  const { user } = useAuth();

  return (
    <Container>
      {user && <Sidebar />}
      <Title>Perfil do Usuário</Title>
      <Subtitle>Gerencie suas informações de conta.</Subtitle>
      {user && (
        <div className="mt-4">
          <p><strong>Nome:</strong> {user.user_metadata?.name || "Nome não informado"}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>
      )}
    </Container>
  );
};
