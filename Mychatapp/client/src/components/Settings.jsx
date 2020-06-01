import React from "react";
import styled from "styled-components";
import Avatar from "./Common/Avatar";
import { ACCOUNT_UPDATE } from "../redux/actions";
import FileUpload from "./Common/FileUpload";
import ToggleSwitch from "./Common/ToggleSwitch";

const Wrapper = styled.div`
  display: flex;
  position: fixed;
  height: 100vh;
  width: 100vw;
  align-items: center;
  justify-content: center;
  z-index: 3;
  color: ${props => props.theme.backgroundColor};
  transition: ${props => props.theme.transition};
`;

const BackgroundShadow = styled.div`
  position: fixed;
  background-color: rgba(0, 0, 0, 0.5);
  height: 100%;
  width: 100%;
`;

const Modal = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  background-color: inherit;
  border-radius: 0.25em;
  padding: 1em;
  flex-basis: 500px;
  z-index: 4;
  background-color: ${props => props.theme.background};
  transition: ${props => props.theme.transition};
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: ${props => props.justify || "unset"};
  margin: ${props => props.margin || "0 0 1.5rem 0;"};
`;

const Title = styled.h1`
  font-family: "Roboto", sans-serif;
  font-weight: 400;
  color: inherit;
  font-size: 1.25rem;
  margin-left: 1rem;
`;

const Option = styled.p`
  font-family: "Roboto", sans-serif;
  font-weight: 500;
  color: inherit;
  font-size: 0.8em;
  padding: 0;
  margin: 0;
`;

const Description = styled(Option)`
  font-weight: 400;
  font-size: 0.6em;
  color: ${props => props.theme.foregroundColor};
  transition: ${props => props.theme.transition};
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
`;

const Settings = ({ socket, setActiveList, visible_in_searches, avatar }) => {
  const handleVisibilityUpdate = () =>
    socket.emit(ACCOUNT_UPDATE, {
      update: "visible_in_searches",
      value: !visible_in_searches
    });

  const handleFile = async (file, extension) => {
    socket.emit(ACCOUNT_UPDATE, {
      update: "avatar",
      extension: extension,
      value: file
    });
  };

  return (
    <Wrapper>
      <BackgroundShadow onClick={() => setActiveList("chats")} />
      <Modal>
        <Row>
          <Avatar image={avatar} />
          <Title>Account Settings</Title>
        </Row>
        <Row justify="space-between" margin="0.75rem 0">
          <Column>
            <Option>Account Visibility</Option>
            <Description>
              Enable other users to find your account via search.
            </Description>
          </Column>
          <ToggleSwitch
            onClick={handleVisibilityUpdate}
            state={visible_in_searches}
          />
        </Row>
        <Row justify="space-between" margin="0.75rem 0">
          <Column>
            <Option>Change Avatar</Option>
            <Description>Upload an image to use as an avatar.</Description>
          </Column>
          <FileUpload uid="avatar" file={handleFile} text="Upload Image" />
        </Row>
      </Modal>
    </Wrapper>
  );
};

export default Settings;
