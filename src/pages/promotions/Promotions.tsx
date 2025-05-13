import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Container } from "../home/Layout";
import { Title } from "../../components/common/Title";
import { Subtitle } from "../../components/common/Subtitle";
import { Sidebar } from "../../components/sidebar/Sidebar";

export const Promotions: React.FC = () => {
  const { user } = useAuth();

  return (
    <Container>
      {user && <Sidebar />}
      <Title>Promoções</Title>
      <Subtitle>Crie e gerencie campanhas promocionais para atrair mais clientes.</Subtitle>
    </Container>
  );
};
