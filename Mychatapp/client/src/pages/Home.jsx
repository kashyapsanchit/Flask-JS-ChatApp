import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Lists from "../components/Lists/ListContainer";
import Messages from "../components/Messages/MessagesContainer";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import Settings from "../components/Settings";
import SnackbarContainer from "../components/Snackbar/SnackbarContainer";
import AccountPopup from "../components/AccountPopup";
import { SET_NIGHT_MODE } from "../redux/actions";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 64px auto 1fr;
  grid-template-rows: 1fr;
  grid-template-areas: "nav lists messages";
  height: 100%;
  width: 100%;
  background-color: #f7f7f7;
`;

const Home = ({ socket, nightModeState }) => {
  const user = useSelector(state => state.rootReducer.user);
  const [listState, setListState] = useState({ active: "chats", open: false });
  const [accountOverview, set] = useState({ open: false, top: 0, right: 0 });

  const handleNavClick = e => {
    if (e === listState.active) {
      setListState({ ...listState, open: !listState.open });
    } else {
      setListState({ ...listState, open: true, active: e });
    }
  };

  const handleNavAvatarClick = e => {
    if (accountOverview.open) {
      set({ ...accountOverview, open: false });
    } else {
      let rect = e.currentTarget.getBoundingClientRect();
      set({
        open: true,
        right: rect.right + rect.height / 3,
        top: rect.top + rect.width / 2
      });
    }
  };

  const dispatch = useDispatch();
  const handleModeChange = () => dispatch({ type: SET_NIGHT_MODE });
  const handleListChange = e => setListState({ ...listState, active: e });
  return (
    socket && (

        <Wrapper>
          {accountOverview.open && (
            <AccountPopup
              socket={socket}
              top={accountOverview.top}
              right={accountOverview.right}
              avatar={user.avatar}
              username={user.username}
              setActiveList={handleListChange}
            />
          )}
          <Navbar
            socket={socket}
            avatar={user.avatar}
            activeList={listState.active}
            setActiveList={handleNavClick}
            setPos={handleNavAvatarClick}
            setNightModeState={handleModeChange}
            nightModeState={nightModeState}
          />
          <Lists
            socket={socket}
            open={listState.open}
            activeList={listState.active}
            setActiveList={handleListChange}
          />
          <Messages socket={socket} />
          <SnackbarContainer socket={socket} />
          {listState.active === "settings" && (
            <Settings
              socket={socket}
              visible_in_searches={user.visible_in_searches}
              avatar={user.avatar}
              setActiveList={handleListChange}
            />
          )}
        </Wrapper>

    )
  );
};

export default Home;
