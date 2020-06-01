import React from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { logout } from "../redux/actions";
import Avatar from "./Common/Avatar";
import Button from "./Common/Button";

const Wrapper = styled.div`
  display: flex;
  position: fixed;
  flex-direction: column;
  align-items: center;
  max-width: 150px;
  top: ${props => props.top}px;
  left: ${props => props.right}px;
  background: ${props => props.theme.background};
  padding: 0.5rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  width: 100%;
  z-index: 2;
  transition: ${props => props.theme.transition};
  & > button {
    font-size: 0.7rem;
    width: 100%;
  }
`;

const Username = styled.div`
  font-size: 0.85rem;
  font-family: "Roboto", "Helvetica", "Arial", sans-serif;
  font-weight: 500;
  color: ${props => props.theme.backgroundColor};
  padding: 0.5rem;
`;

const AccountPopup = ({ top, right, avatar, username, setActiveList }) => {
  const dispatch = useDispatch();
  const logoutFunc = async () => {
    const resp = await fetch("/api/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include"
    });
    if (resp.status === 200) {
      dispatch(logout());
    }
  };
  return (
    <Wrapper top={top} right={right}>
      <Avatar image={avatar} size="32px" />
      <Username>{username}</Username>
      <Button onClick={logoutFunc}>Logout</Button>
      <Button onClick={() => setActiveList("settings")}>Settings</Button>
    </Wrapper>
  );
};

export default AccountPopup;
