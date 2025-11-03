import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Container } from "../home/Layout";
import { Title } from "../../components/common/Title";
import { Subtitle } from "../../components/common/Subtitle";
import { Sidebar } from "../../components/sidebar/Sidebar";

export const Help: React.FC = () => {
  const { user } = useAuth();

  return (
    <Container>
      <Title>Ajuda</Title>
      <Subtitle>Encontre orientações sobre o uso do sistema e suporte técnico.</Subtitle>
    </Container>
  );
};
