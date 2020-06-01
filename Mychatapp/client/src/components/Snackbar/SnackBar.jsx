import React, { useEffect } from "react";
import styled from "styled-components";
import { IoIosClose } from "react-icons/io";
import { ERROR } from "../../redux/actions";
import Avatar from "../Common/Avatar";
const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 12px;
  align-items: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  background-color: ${props =>
    props.bgColor ? "rgba(211, 47, 47, 1)" : "rgb(245, 245, 245)"};
  padding: 0.5rem 1rem;
  min-width: 280px;
  margin: 0.25rem;
`;

const DismissBtn = styled.span`
  padding: 0.25rem;
  border-radius: 50%;
  margin-left: 1rem;
  display: flex;
  margin-right: -0.5rem;
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
  &:active {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

const Message = styled.span`
  font-size: 0.75rem;
  font-family: "Roboto", "Helvetica", "Arial", sans-serif;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.87);
  line-height: 1.43;
  letter-spacing: 0.01071em;
  padding: 0.5rem 0rem;
`;

const CloseBtn = styled(IoIosClose)`
  font-size: 1.85rem;
  color: rgba(0, 0, 0, 0.87);
`;

const StyledAvatar = styled(Avatar)`
  margin-right: 0.5rem;
`;

const Snackbar = ({
  uuid,
  type,
  message,
  dismiss,
  avatar = null,
  sender = null
}) => {
  useEffect(() => {
    if (type !== ERROR) {
      setTimeout(() => dismiss(uuid), 3000);
    }
  }, [dismiss, type, uuid]);
  return (
    <Wrapper bgColor={type === ERROR}>
      {avatar && <StyledAvatar image={avatar} username={sender} />}
      <Message>{message}</Message>
      <DismissBtn onClick={() => dismiss(uuid)}>
        <CloseBtn size="1em" />
      </DismissBtn>
    </Wrapper>
  );
};

export default Snackbar;
