import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import ListItem from "./ListItem";
import ListNotification from "./ListNotification";
import SearchInput from "./Search";
import { ADD_CHAT, LOAD_USERS, setActiveChat } from "../../redux/actions";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  border-right: ${props => props.theme.border};
  min-width: 280px;
  overflow-y: hidden;
  grid-area: lists;
  padding: 1.5rem 0;
  z-index: 1;
  background: ${props => props.theme.background};
  transition: ${props => props.theme.transition};
  @media (max-width: 700px) {
    position: absolute;
    left: ${props => (props.open ? "64px" : "-100%")};
    height: 100%;
    transition: all 0.25s ease-in-out;
  }
`;

const Scroll = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  scrollbar-width: thin;
  grid-area: lists;
`;

const SectionTitle = styled.p`
  text-align: center;
  margin: 0.5em 0;
  font-family: "Montserrat", sans-serif;
  font-weight: 500;
  font-size: 0.6725em;
  color: ${props => props.theme.backgroundText};
  background-color: ${props => props.theme.elemBackground};
  transition: ${props => props.theme.transition};
`;

const Lists = ({ socket, open, activeList, setActiveList }) => {
  const [search, setSearch] = useState("");
  const activeChat = useSelector(state => state.rootReducer.activeChat.id);
  const notifications = useSelector(
    state => state.rootReducer.user.notifications
  );

  const chats = useSelector(state => state.rootReducer.chats).filter(
    d => search === "" || d.recipient.includes(search)
  );

  const friends = useSelector(state => state.rootReducer.friends).filter(
    d => search === "" || d.username.includes(search)
  );

  const accounts = useSelector(state => state.rootReducer.accounts).filter(
    d => search === "" || d.username.includes(search)
  );

  const dispatch = useDispatch();

  const handleNewChat = (username, id) => {
    let check = chats.find(d => d.recipient === username);
    if (check) {
      dispatch(
        setActiveChat({ id: check.id, recipient: username, recipientId: id })
      );
    } else {
      socket.emit(ADD_CHAT, username);
    }
    setActiveList("chats");
  };

  const disp = e => search !== "" || activeList === e;
  const dispTitle = search !== "";

  return (
    <Wrapper open={open}>
      <SearchInput
        value={search}
        onFocus={() => socket.emit(LOAD_USERS)}
        search={setSearch}
      />
      <Scroll>
        {dispTitle && <SectionTitle>Chats</SectionTitle>}
        {disp("chats") &&
          chats.map(d => (
            <ListItem
              key={d.id}
              username={d.recipient}
              avatar={d.avatar}
              userActive={d.active}
              chatActive={activeChat === d.id}
              displayStatus
              onClick={() =>
                dispatch(
                  setActiveChat({
                    id: d.id,
                    recipient: d.recipient,
                    recipientId: d.recipientId,
                    avatar: d.avatar
                  })
                )
              }
              message={d.last_message}
              timestamp={d.last_message_timestamp}
            />
          ))}
        {dispTitle && <SectionTitle>Friends</SectionTitle>}
        {disp("friends") &&
          friends.map(d => (
            <ListItem
              id={d.id}
              key={d.id}
              username={d.username}
              onClick={() => handleNewChat(d.username, d.id)}
              avatar={d.avatar}
              active={d.active}
              displayStatus
            />
          ))}
        {dispTitle && (
          <>
            <SectionTitle>Users</SectionTitle>
            {accounts.map(d => (
              <ListItem
                id={d.id}
                key={d.id}
                username={d.username}
                avatar={d.avatar}
                onClick={() => socket.emit("FRIEND_REQUEST", d.id)}
              />
            ))}
          </>
        )}
        {disp("notifications") &&
          notifications.map(d => (
            <ListNotification
              socket={socket}
              id={d.id}
              key={d.id}
              sender={d.sender}
              message={d.message}
              type={d.type}
              image={d.avatar}
            />
          ))}
      </Scroll>
    </Wrapper>
  );
};

export default Lists;
