import React from "react";
import styled from "styled-components";
import Avatar from "../Common/Avatar";

const Wrapper = styled.div`
  padding: 0.5em 1em;
  display: flex;
  justify-content: space-around;
  background-color: ${props => props.selected && "rgba(0, 0, 0, 0.075)"};
  border-radius: 12px;
  margin: 0 0.5rem;
  &:hover {
    background-color: rgba(0, 0, 0, 0.075);
  }
`;

const NotificationText = styled.div`
  font-family: "Montserrat", sans-serif;
  font-weight: 600;
  font-size: 0.65em;
  padding: 0.25rem 0;
  color: ${props => props.theme.backgroundColor};
  & > span {
    color: inherit;
  }
`;

const Button = styled.button`
  outline: none;
  border-radius: 0.25em;
  border: ${props =>
    props.theme.backgroundColor || "1px solid rgba(0, 0, 0, 0.2)"};
  padding: 0.25em;
  color: ${props => props.theme.backgroundColor || "rgba(0, 0, 0, 0.8)"};
  background-color: transparent;
  font-size: 0.6em;
  flex-grow: 1;
  &:hover {
    background-color: rgba(0, 0, 0, 0.2);
  }
  margin: ${props => props.margin || 0};
`;

const ButtonRow = styled.div`
  padding: 0.25rem 0;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: 0.5rem;
`;

const ListNotification = ({ id, sender, message, type, socket, image }) => {
  const handleAccept = () =>
    socket.emit("FRIEND_REQUEST_ACCEPTED", { username: sender, id: id });

  const handleDelete = () => socket.emit("DELETE_NOTIFICATION", id);

  const nonActionable = type === "ERROR" || type === "FRIEND_REQUEST_ACCEPTED";
  const actionable = type === "FRIEND_REQUEST";
  return (
    <Wrapper>
      {actionable && <Avatar username={sender} image={image} />}
      <Column>
        <NotificationText>
          <span>{message}</span>
        </NotificationText>
        {actionable && (
          <ButtonRow>
            <Button margin="0 .25em 0 0" onClick={handleAccept}>
              Accept
            </Button>
            <Button margin="0 0 0 .25em" onClick={handleDelete}>
              Reject
            </Button>
          </ButtonRow>
        )}
        {nonActionable && (
          <ButtonRow>
            <Button onClick={handleDelete}>Dismiss</Button>
          </ButtonRow>
        )}
      </Column>
    </Wrapper>
  );
};

export default ListNotification;
