import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 2;
`;

const Shadow = styled.div`
  position: absolute;
  background-color: rgba(0, 0, 0, 0.8);
  height: 100%;
  width: 100%;
  z-index: -1;
`;

const Image = styled.img`
max-height: 90vh;
max-width: 90vw;
border-radius: 1em;
`

const ImageViewer = ({ image, callback }) => (
  <Wrapper>
    <Shadow onClick={callback} />
    <Image src={image} onClick={callback}/>
  </Wrapper>
);

export default ImageViewer;
