import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import Snackbar from "./Snackbar";
import { DISMISS_NOTIFICATION } from "../../redux/actions";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: fixed;
  right: 1rem;
  top: 1rem;
  max-height: calc(100vh - 1rem);
  overflow-y: auto;
`;

const SnackbarContainer = ({ socket }) => {
  const notifications = useSelector(
    state => state.rootReducer.user.notifications
  );

  const dismiss = id => socket.emit(DISMISS_NOTIFICATION, id);

  return (
    <Wrapper>
      {notifications.map(
        d =>
          !d.dismissed && (
            <Snackbar
              type={d.type}
              key={d.id}
              uuid={d.id}
              message={d.message}
              dismiss={dismiss}
              avatar={d.avatar}
            />
          )
      )}
    </Wrapper>
  );
};

export default SnackbarContainer;
