import React from "react";
import styled from "styled-components";
import {
  FaUserFriends,
  FaComments,
  FaBell,
  FaCog,
  FaMoon
} from "react-icons/fa";
import Avatar from "./Common/Avatar";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  grid-area: nav;
  padding: 1.5rem 0;
  justify-content: space-between;
  z-index: 2;
  border-right: ${props => props.theme.border};
  background: ${props => props.theme.background};
  transition: ${props => props.theme.transition};
`;

const Contacts = styled(FaUserFriends)`
  padding: 1em 0;
  box-sizing: content-box;
  color: ${p =>
    p.active === "friends"
      ? p.theme.foregroundColor
      : p.theme.backgroundColor};
`;

const Chats = styled(FaComments)`
  padding: 1em 0;
  box-sizing: content-box;
  color: ${p =>
    p.active === "chats" ? p.theme.foregroundColor : p.theme.backgroundColor};
`;
const Notifications = styled(FaBell)`
  padding: 1em 0;
  box-sizing: content-box;
  color: ${p =>
    p.active === "notifications"
      ? p.theme.foregroundColor
      : p.theme.backgroundColor};
`;

const Settings = styled(FaCog)`
  padding: 0.5em 0;
  box-sizing: content-box;
  color: ${p =>
    p.active === "settings"
      ? p.theme.foregroundColor
      : p.theme.backgroundColor};
`;

const NightMode = styled(FaMoon)`
  padding: 0.5em 0;
  box-sizing: content-box;
  color: ${p => p.theme.nightModeBtn};
`;

const ListOptions = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const AppOptions = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledAvatar = styled(Avatar)`
  margin: 0 0 0.75rem 0;
  cursor: pointer;
`;

const Navbar = ({
  avatar,
  activeList,
  setActiveList,
  setPos,
  setNightModeState,
  nightModeState
}) => (
  <Wrapper>
    <ListOptions>
      <StyledAvatar size="32px" image={avatar} onClick={setPos} />
      <Contacts
        size="20px"
        active={activeList}
        onClick={() => setActiveList("friends")}
      />
      <Chats
        size="20px"
        active={activeList}
        onClick={() => setActiveList("chats")}
      />
      <Notifications
        size="20px"
        active={activeList}
        onClick={() => setActiveList("notifications")}
      />
    </ListOptions>
    <AppOptions>
      <NightMode
        size="20px"
        onClick={() => setNightModeState(!nightModeState)}
      />
      <Settings
        size="20px"
        active={activeList}
        onClick={() => setActiveList("settings")}
      />
    </AppOptions>
  </Wrapper>
);

export default Navbar;
