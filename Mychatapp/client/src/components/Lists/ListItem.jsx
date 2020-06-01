import React from "react";
import styled, { withTheme } from "styled-components";
import Avatar from "../Common/Avatar";

const Wrapper = styled.div`
  padding: 0.5em 1em;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background-color: ${props =>
    props.selected && props.theme.elemBackgroundHover};
  border-radius: 12px;
  margin: 0 0.5rem;
  color: ${props => props.theme.backgroundColor};
  transition: ${props => props.theme.transition};
  &:hover {
    background-color: ${props => props.theme.elemBackgroundHover};
  }
`;

const Column = styled.div`
  display: flex;
  flex-grow: 1;
  margin-left: 0.75em;
  flex-direction: column;
`;

const Name = styled.p`
  font-family: "Montserrat", sans-serif;
  font-weight: 600;
  font-size: 0.6725em;
  color: inherit;
  margin: 0;
`;

const LastMessage = styled(Name)`
  font-size: 0.6225em;
  color: inherit;
`;

const LastMessageTime = styled(LastMessage)`
  color: inherit;
`;

const Listitem = ({
  onClick,
  onContextMenu,
  chatActive,
  username,
  avatar,
  userActive,
  displayStatus,
  message = "",
  timestamp = null
}) => (
  <Wrapper
    onClick={onClick}
    selected={chatActive}
  >
    <Avatar
      active={userActive}
      username={username}
      displayStatus={displayStatus}
      image={avatar}
    />
    <Column>
      <Name>{username}</Name>
      <LastMessage>{message}</LastMessage>
    </Column>
    {timestamp && (
      <LastMessageTime>
        {new Date(timestamp).toLocaleTimeString().slice(0, 5)}
      </LastMessageTime>
    )}
  </Wrapper>
);

export default withTheme(Listitem);
