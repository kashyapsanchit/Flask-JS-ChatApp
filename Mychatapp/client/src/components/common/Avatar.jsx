import React from "react";
import styled from "styled-components";

const AvatarWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
const AvatarImg = styled.div`
  position: relative;
  border-radius: 50%;
  width: ${props => props.size};
  height: ${props => props.size};
  padding: 2px;
  box-sizing: unset;
  border: 1px solid rgba(0, 0, 0, 0.2);
  background-image: url(${props => props.image});
  background-position: center;
  background-size: cover;
  background-clip: padding-box;
`;

const Activity = styled.div`
  height: 8px;
  width: 8px;
  border-radius: 50%;
  display: inline-block;
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: ${props => (props.active ? "#00C853" : "#d50000")};
`;

const Avatar = ({
  image,
  username,
  size = "24px",
  active,
  onClick,
  className,
  displayStatus = false,
}) => (
  <AvatarWrapper className={className} onClick={onClick}>
    <AvatarImg size={size} image={image} alt={username}>
      {displayStatus && <Activity active={active} />}
    </AvatarImg>
  </AvatarWrapper>
);

export default Avatar;
