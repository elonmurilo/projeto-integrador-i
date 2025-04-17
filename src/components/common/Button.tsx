import { styled } from "styled-components";

export const Button = styled.button`
  padding: 0.5rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

export const GoogleButton = styled(Button)`
  background-color: #4285f4;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    background-color: #357abd;
  }
`;

export const LogoutButton = styled(Button)`
  background-color: #dc3545;
  color: white;
`;

export const LoginButton = styled(Button)`
  background-color: #007bff;
  color: white;
`;

export const RegisterButton = styled(Button)`
  background-color: #28a745;
  color: white;
`;
