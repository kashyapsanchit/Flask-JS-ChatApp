import React, { useState } from "react";
import styled from "styled-components";

const StyledInput = styled.input`
  border-radius: 6px;
  border: ${props =>
    props.error
      ? "1px solid rgba(213, 0, 0, 1)"
      : "1px solid rgba(0, 0, 0, 0.2)"};
  padding: 0.75em;
  font-family: "Roboto", sans-serif;
  font-weight: 500;
  width: 100%;
  margin: 0.5em 0;
`;

const StyledLabel = styled.label`
  font-family: "Roboto", sans-serif;
  font-weight: 500;
  font-size: 0.875em;
  color: rgba(0, 0, 0, 0.4);
  position: absolute;
  top: 0;
  bottom: 0;
  transform: translatex(0.75em);
  transform: ${props => props.selected && "translatey(-65%)"};
  font-size: ${props => props.selected && ".7em"};
  color: ${props => props.selected && "rgba(0, 0, 0, .6)"};
  align-items: center;
  display: flex;
  pointer-events: none;
  transition: 0.5s ease;
`;

const Wrapper = styled.div`
  position: relative;
  flex-grow: 1;
  margin: 0.75em 0;
`;

const Input = ({
  label,
  type,
  name,
  value,
  onChange,
  error,
  onBlur,
  onFocus
}) => {
  const [selected, set] = useState(false);
  const handleBlur = () => {
    value === "" && set(!selected);
    onBlur && onBlur();
  };

  const handleFocus = () => {
    value === "" && set(!selected);
    onFocus && onFocus();
  };
  return (
    <Wrapper>
      <StyledLabel selected={selected}>{label}</StyledLabel>
      <StyledInput
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        error={error}
      />
    </Wrapper>
  );
};

export default Input;
