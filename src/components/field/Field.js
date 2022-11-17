import React from "react";
import styled from "styled-components";

const FieldStyles = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  row-gap: 20px;
  margin-bottom: 30px;
  &:last-child {
    margin-bottom: 0px;
  }
`;

const Field = ({children}) => {
  return <FieldStyles>{children}</FieldStyles>;
};

export default Field;
