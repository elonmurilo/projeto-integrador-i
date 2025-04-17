import styled from "styled-components";

export const Container = styled.div`
  width: 250px;
  height: 100vh;
  background-color: #f4f4f4;
  padding: 20px;
  position: fixed;
  left: 0;
  top: 0;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
`;

export const MenuItem = styled.div`
  margin: 10px 0;
  padding: 10px;
  cursor: pointer;
  border-radius: 5px;
  &:hover {
    background-color: #e0e0e0;
  }
`;
