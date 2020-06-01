import React from "react";
import styled from "styled-components";

const Label = styled.label`
  border-radius: 0.5em;
  background-color: ${props => props.theme.buttonBackground};
  color: ${props => props.theme.buttonText};
  border: ${props => props.theme.buttonBorder};
  padding: 0.75em 1em;
  font-family: "Roboto", sans-serif;
  font-weight: 500;
  font-size: 0.7em;
  width: max-content;
  transition: ${props => props.theme.transition};
`;

const Input = styled.input`
  width: 1px;
  height: 1px;
  position: absolute;
`;

const FileUpload = ({ file, className, children, text, uid }) => {
  const handleChange = e => {
    if (
      e.currentTarget.files.length > 0 &&
      e.currentTarget.files[0].type.split("/")[0] === "image"
    ) {
      file(
        e.currentTarget.files[0],
        e.currentTarget.files[0].name.split(".")[1]
      );
    }
  };
  return (
    <Label htmlFor={uid} className={className}>
      {children}
      {text}
      <Input type="file" onChange={handleChange} id={uid} name={uid} />
    </Label>
  );
};

export default FileUpload;
