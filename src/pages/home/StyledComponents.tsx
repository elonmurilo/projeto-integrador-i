import styled from "styled-components";

interface CircularButtonProps {
  backgroundColor?: string;
  hoverColor?: string;
}

export const CircularButton = styled.button<CircularButtonProps>`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: ${(props) => props.backgroundColor || "#b197fc"};
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: ${(props) => props.hoverColor || "#9a7bf7"};
  }

  &:focus {
    outline: none;
  }
  margin-top: 24px;
`;

export const Label = styled.div`
  margin-top: 10px;
  font-size: 12px;
  width: 80px;
  text-align: center;
  font-weight: 600;
  line-height: 1.2;
`;
