import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Container } from "../home/Layout";
import { Title } from "../../components/common/Title";
import { Subtitle } from "../../components/common/Subtitle";
import { Sidebar } from "../../components/sidebar/Sidebar";

export const Clients: React.FC = () => {
  const { user } = useAuth();

  return (
    <Container>
      {user && <Sidebar />}
      <Title>Clientes</Title>
      <Subtitle>Gerencie seus clientes de forma simples, organizada e inteligente.</Subtitle>
    </Container>
  );
};
