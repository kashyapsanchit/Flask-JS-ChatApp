import React from 'react'
import styled from 'styled-components'

const ToggleLabel = styled.label`
  display: flex;
  cursor: pointer;
  min-width: 50px;
  min-height: 25px;
  border-radius: 25px;
  position: relative;
  transition: background-color 0.2s;
  background: ${props => (props.state ? "rgba(90, 216, 177, 1)" : "rgba(0, 0, 0, 0.4)")};
`;

const ToggleSpan = styled.span`
  position: absolute;
  top: 2px;
  left: 2px;
  min-width: 21px;
  min-height: 21px;
  border-radius: 50%;
  transition: 0.2s;
  background: rgb(245, 245, 245);
  transform: ${props => (props.state ? "translateX(calc(100% + 4px))" : "unset")};
`;


const ToggleSwitch = ({ onClick, state}) => (
  <ToggleLabel onClick={onClick} state={state}>
    <ToggleSpan state={state} />
  </ToggleLabel>
)

export default ToggleSwitch;