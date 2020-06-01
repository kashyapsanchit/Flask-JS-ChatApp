import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import { ADD_MESSAGE_TO_CHAT } from "../../redux/actions";
import { FaSmile, FaImage } from "react-icons/fa";
import FileUpload from "../Common/FileUpload";
import EmojiContainer from "../Emoji/EmojiContainer";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem 0.75rem;
  min-height: 2rem;
  max-height: 8rem;
  border-radius: 12px;
  color: ${props => props.theme.backgroundColor};
  background-color: ${props => props.theme.inputBackground};
  transition: all 0.05s ease-in-out;
  margin: 0.5rem 1.5rem 0 1.5rem;
  transition: ${props => props.theme.transition};
  &:focus-within {
    ${props => props.theme.foregroundColor};
  }
`;

const Input = styled.div`
  display: flex;
  align-items: center;
  white-space: pre-wrap;
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-all;
  overflow: auto;
  scrollbar-width: thin;
  font-family: "Montserrat", sans-serif;
  font-weight: 500;
  font-size: 0.6725rem;
  line-height: 140%;
  height: 100%;
  flex-grow: 1;
`;

const ImageBtn = styled(FileUpload)`
  background-color: transparent;
  display: flex;
  padding: 0;
  color: inherit;
  > svg {
    font-size: 20px;
    color: inherit;
  }
`;

const EmojiBtn = styled(FaSmile)`
  margin-right: 0.5rem;
  color: inherit;
`;

const ChatInput = ({ socket, activeChatId }) => {
  const ref = useRef(null);
  const [emojiSelector, set] = useState({ open: false, top: 0, right: 0 });
  const placeholder = "Enter message...";

  const handleFile = async (image, extension) => {
    try {
      if (activeChatId !== "") {
        socket.emit(ADD_MESSAGE_TO_CHAT, {
          image: image,
          extension: extension,
          chat: activeChatId
        });
      }
    } catch (err) {
      // Ignore
    }
  };

  const sendMessage = e => {
    let text = e.currentTarget.innerText.trim();
    if (e.key === "Enter" && activeChatId !== "" && text !== "") {
      socket.emit(ADD_MESSAGE_TO_CHAT, {
        message: text,
        chat: activeChatId
      });
      e.currentTarget.innerText = "";
    }
    set(false);
  };

  const handleFocusBlur = e => {
    if (e.currentTarget.innerText.trim() === placeholder) {
      e.currentTarget.innerText = "";
    } else if (e.currentTarget.innerText.trim() === "") {
      e.currentTarget.innerText = placeholder;
    }
  };

  const addEmoji = icon => {
    if (ref.current.innerText.trim() === placeholder) {
      return (ref.current.innerText = icon);
    }
    return (ref.current.innerText += icon);
  };

  const handleEmojiSelectorOpen = e => {
    if (emojiSelector.open) {
      return set({ ...emojiSelector, open: false });
    }
    let rect = e.currentTarget.getBoundingClientRect();
    return set({
      open: !emojiSelector.open,
      right: rect.right - 220 + rect.width,
      top: rect.top - 200 - rect.height
    });
  };

  useEffect(() => {
    if (ref) ref.current.innerText = placeholder;
  }, [activeChatId]);

  return (
    <Wrapper>
      <Input
        contentEditable="true"
        ref={ref}
        onKeyUp={sendMessage}
        onFocus={handleFocusBlur}
        onBlur={handleFocusBlur}
        suppressContentEditableWarning={true}
      >
        {placeholder}
      </Input>
      <EmojiBtn onClick={handleEmojiSelectorOpen} size="1em" />
      {emojiSelector.open && (
        <EmojiContainer
          selected={addEmoji}
          top={emojiSelector.top}
          right={emojiSelector.right}
        />
      )}
      <ImageBtn uid="mms" file={handleFile}>
        <FaImage size="1em" />
      </ImageBtn>
    </Wrapper>
  );
};

export default ChatInput;
