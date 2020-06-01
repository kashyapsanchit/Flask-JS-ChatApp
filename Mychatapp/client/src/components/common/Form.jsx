import React from "react";
import styled from "styled-components";

const StyledForm = styled.form`
  display: flex;
  width: 100%;
  flex-direction: column;
  border-radius: 6px;
  padding: 2em 2em 2em 2em;
  box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.14), 0 2px 1px -1px rgba(0, 0, 0, 0.12),
    0 1px 3px 0 rgba(0, 0, 0, 0.2);
  max-width: 500px;
  & > h1 {
    font-family: "Open Sans", sans-serif;
    font-weight: 700;
    color: rgba(0, 0, 0, 0.7);
  }
  @media (max-width: 576px) {
    border: none;
    box-shadow: none;
    min-width: 100%;
  }
`;

const Error = styled.p`
  text-align: center;
  font-family: "Roboto", sans-serif;
  font-weight: 500;
  font-size: 0.875em;
  color: rgba(213, 0, 0, 1);
`;

const Form = ({ title, error, children, onSubmit }) => (
  <StyledForm
    onSubmit={e => {
      e.preventDefault();
      onSubmit(e);
    }}
  >
    {title && <h1>{title}</h1>}
    {error && <Error>{error}</Error>}
    {children}
  </StyledForm>
);

export default Form;
