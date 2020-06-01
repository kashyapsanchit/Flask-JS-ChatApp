import React from "react";
import styled from "styled-components";
import emojis from "./Emojis";

const Wrapper = styled.div`
  display: flex;
  position: fixed;
  left: ${props => props.right}px;
  max-width: 200px;
  overflow: auto;
  flex-wrap: wrap;
  max-height: 200px;
  border-radius: 12px;
  background-color: inherit;
  scrollbar-width: thin;
  padding: 0.25rem;
  top: ${props => props.top}px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
`;

const Emoji = styled.div`
  display: flex;
  color: rgba(0, 0, 0, 1);
  cursor: pointer;
`;

const EmojiContainer = ({ selected, right, top }) => (
  <Wrapper right={right} top={top}>
    {emojis.map(d => (
      <Emoji key={d} onClick={() => selected(d)}>{d}</Emoji>
    ))}
  </Wrapper>
);

export default EmojiContainer;
