import React from "react";
import styled from "styled-components";
import Avatar from "../Common/Avatar";
import Image from "./Image";
const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: ${props => (props.justify ? "flex-start" : "flex-end")};
  padding: 0.25em 0;
  color: ${props => props.theme.foregroundColor};
  transition: ${props => props.theme.transition};
`;

const MessageContent = styled.div`
  border-radius: ${props =>
    props.borderRadius ? ".25em 1em 1em" : "1em .25em 1em 1em"};
  margin-left: ${props => (props.margin ? ".5rem" : "unset")};
  padding: ${props => (props.image ? "0" : "0.5em 1em")};
  max-width: ${props => (props.image ? "35%" : "unset")};
  overflow: ${props => (props.image ? "hidden" : "unset")};
  display: ${props => (props.image ? "flex" : "unset")};
  flex-direction: ${props => (props.image ? "column" : "unset")};
  background-color: ${props => props.theme.messageBackground};
  transition: ${props => props.theme.transition};
  color: inherit;
  & > span {
    font-family: "Roboto", sans-serif;
    text-rendering: optimizeLegibility;
    font-size: 0.85em;
    color: inherit;
  }
`;

const Message = ({
  received = false,
  message,
  recipient,
  avatar,
  image,
  onClick
}) => (
  <Wrapper justify={received}>
    {received && <Avatar size="20px" name={recipient} image={avatar} />}
    <MessageContent margin={received} borderRadius={received} image={image}>
      <span>{message}</span>
      {image && <Image image={image} onClick={onClick} />}
    </MessageContent>
  </Wrapper>
);

export default Message;
