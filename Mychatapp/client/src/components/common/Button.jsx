import React from "react";
import styled from "styled-components";

const StyledButton = styled.button`
  display: flex;
  flex-grow: 1;
  margin-top: 1em;
  padding: 0.5em;
  justify-content: center;
  font-family: "Open Sans", sans-serif;
  font-weight: 600;
  color: ${props => props.theme.buttonText || "rgb(245,245,245)"};
  font-size: 1em;
  border-radius: 6px;
  border: ${props => props.theme.buttonBorder || "none"};
  background-color: ${props =>
    props.theme.buttonBackground || "rgb(31, 31, 31)"};
  outline: none;
  transition: ${props => props.theme.transition};
  &:hover {
    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
      0 3px 1px -2px rgba(0, 0, 0, 0.12), 0 1px 5px 0 rgba(0, 0, 0, 0.2);
  }
  &:active {
    box-shadow: none;
  }
`;

const Button = ({ children, onClick, disabled }) => (
  <StyledButton disabled={disabled} onClick={onClick}>
    {children}
  </StyledButton>
);
export default Button;
