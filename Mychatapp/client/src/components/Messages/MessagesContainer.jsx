import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import ChatInput from "./ChatInput";
import Message from "./Message";
import { LOAD_ACTIVE_CHAT_MESSAGES } from "../../redux/actions";
import ImageViewer from "./ImageViewer";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  grid-area: messages;
  justify-content: space-between;
  padding: 1.5rem 0;
  background-color: ${props => props.theme.background};
  transition: ${props => props.theme.transition};
`;

const Scrollable = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  scrollbar-width: thin;
  padding: 0 1.5rem;
`;

const Messages = ({ socket }) => {
  const ScrollRef = useRef(null);
  const chat = useSelector(state => state.rootReducer.activeChat);
  const [imageViewer, set] = useState(null);

  useEffect(() => {
    if (chat.id) socket.emit(LOAD_ACTIVE_CHAT_MESSAGES, chat.id);
  }, [socket, chat.id]);

  useEffect(() => {
    ScrollRef.current.scrollTop = ScrollRef.current.scrollHeight;
  }, [chat.messages]);

  return (
    <Wrapper>
      {imageViewer && (
        <ImageViewer image={imageViewer} callback={() => set(null)} />
      )}
      <Scrollable ref={ScrollRef}>
        {chat.id !== null &&
          chat.messages.map(d => (
            <Message
              key={d.id}
              received={d.username === chat.recipient}
              message={d.message}
              recipient={chat.recipient}
              avatar={chat.avatar}
              image={d.image}
              onClick={() => set(d.image)}
            />
          ))}
      </Scrollable>
      <ChatInput socket={socket} activeChatId={chat.id} />
    </Wrapper>
  );
};

export default Messages;
