import React, { useState } from "react";
import styled from "styled-components";

const Img = styled.img`
  max-width: 100%;
  max-height: 200px;
  display: ${p => (p.state === "loaded" ? "unset" : "none")};
`;

const Image = ({ image, onClick }) => {
  const [state, set] = useState("loading");

  return (
    <>
      <Img
        state={state}
        src={image}
        onError={() => set("failure")}
        onLoad={() => set("loaded")}
        alt="Image not available"
        onClick={onClick}
      />
      {image && state === "loading" && <p>Loading</p>}
      {image && state === "failure" && <p>Failure</p>}
    </>
  );
};

export default Image;
