import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;
  margin: 0 0.75rem 1.5rem 0.75rem;
`;

const Input = styled.input`
  font-family: "Montserrat", sans-serif;
  font-weight: 500;
  font-size: 0.6725rem;
  color: ${props => props.theme.backgroundColor};
  border: none;
  outline: none;
  border-radius: 12px;
  padding: 0.5rem 0.75rem;
  background-color: ${props => props.theme.inputBackground};
  transition: ${props => props.theme.transition};
  flex-grow: 1;
`;

const SearchInput = ({ search, value, onFocus }) => (
  <Wrapper>
    <Input
      type="text"
      name="search"
      placeholder="Search"
      value={value}
      onFocus={onFocus}
      onChange={e => search(e.target.value)}
    />
  </Wrapper>
);

export default SearchInput;
