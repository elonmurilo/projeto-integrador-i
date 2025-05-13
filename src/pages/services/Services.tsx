import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Container } from "../home/Layout";
import { Title } from "../../components/common/Title";
import { Subtitle } from "../../components/common/Subtitle";
import { Sidebar } from "../../components/sidebar/Sidebar";

export const Services: React.FC = () => {
  const { user } = useAuth();

  return (
    <Container>
      {user && <Sidebar />}
      <Title>Serviços</Title>
      <Subtitle>Gerencie os serviços prestados com eficiência e agilidade.</Subtitle>
    </Container>
  );
};
