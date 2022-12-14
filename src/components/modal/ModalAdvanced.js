import React from "react";
import ModalBase from "./ModalBase";

const ModalAdvanced = ({ children, ...props }) => {
  return <ModalBase {...props}>{children}</ModalBase>;
};

export default ModalAdvanced;
