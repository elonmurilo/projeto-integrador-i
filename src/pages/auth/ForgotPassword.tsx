import React from "react";
import styled from "styled-components";
import { ForgotPasswordForm } from "../../components/auth/ForgotPasswordForm";

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

export const ForgotPassword: React.FC = () => {
  return (
    <Container>
      <Card>
        <Title>Recuperar Senha</Title>
        <ForgotPasswordForm />
      </Card>
    </Container>
  );
};
