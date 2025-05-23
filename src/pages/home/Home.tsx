import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Container } from "./Layout";
import { Title } from "../../components/common/Title";
import { Subtitle } from "../../components/common/Subtitle";

import { Sidebar } from "../../components/sidebar/Sidebar";

export const Home: React.FC = () => {
  const { user } = useAuth();

  return (
    <Container>
      {user && <Sidebar />}
      <Title>Bem-vindo ao CleanTrack</Title>
      <Subtitle>
        Gerencie seus clientes e contatos de forma eficiente com nossa
        plataforma de CRM.
      </Subtitle>
    </Container>
  );
};
