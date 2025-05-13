import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Container } from "../home/Layout";
import { Title } from "../../components/common/Title";
import { Subtitle } from "../../components/common/Subtitle";
import { Sidebar } from "../../components/sidebar/Sidebar";

export const Billing: React.FC = () => {
  const { user } = useAuth();

  return (
    <Container>
      {user && <Sidebar />}
      <Title>Faturamento</Title>
      <Subtitle>Acompanhe os registros de faturamento e receitas da empresa.</Subtitle>
    </Container>
  );
};
