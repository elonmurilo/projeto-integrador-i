import React from "react";
import styled from "styled-components";
import { RegisterForm } from "../../components/auth/RegisterForm";

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
`;

const Card = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
`;

export const Register: React.FC = () => {
  return (
    <Container>
      <Card>
        <Title>Cadastro</Title>
        <RegisterForm />
      </Card>
    </Container>
  );
};
