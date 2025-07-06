import React from "react";
import styled from "styled-components";
import { Card } from "./Card";
import { Text } from "./Text";

const InputField = styled.input`
  border: 0px;
  border-bottom: solid 1px grey;
  padding: 2px;
  margin: 4px 0px 4px 0px;
  outline: none;
  display: flex;
  flex: 1;
`;

export const Input = ({
  label,
  name = "input",
  placeholder,
  onKeyUp,
}: {
  label?: string;
  name?: string;
  placeholder?: string;
  onKeyUp?: React.KeyboardEventHandler<HTMLInputElement>;
}) => {
  return (
    <Card style={{ flex: "1 1", gap: "4px", alignItems: "center" }}>
      {label && <Text fontSize="15px" fontWeight="600" text={label} />}
      <InputField name={name} placeholder={placeholder} onKeyUp={onKeyUp} />
    </Card>
  );
};
