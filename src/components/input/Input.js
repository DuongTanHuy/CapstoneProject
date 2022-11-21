import React from "react";
import { useController } from "react-hook-form";
import styled from "styled-components";

const InputStyles = styled.div`
  position: relative;
  width: 100%;
  input {
    width: 100%;
    padding: ${(props) => (props.hasIcon ? "16px 60px 16px 16px" : "16px")};
    background-color: ${(props) => props.theme.grayLight};
    border-radius: 8px;
    font-weight: 500;
    transition: all 0.2s linear;
    border: 2px solid transparent;
    outline: none;
  }
  input:focus {
    background-color: white;
    border-color: ${(props) => props.theme.primary};
  }
  input ::-webkit-input-placeholder {
    color: #84878b;
  }
  input::-moz-input-placeholder {
    color: #84878b;
  }
  .input-icon {
    position: absolute;
    top: 50%;
    right: 20px;
    transform: translateY(-50%);
    cursor: pointer;
  }
`;

const Input = ({
  name = "",
  type = "text",
  children,
  control,
  className = "",
  ...props
}) => {
  const { field } = useController({ control, name, defaultValue: "" });

  return (
    <InputStyles hasIcon={children ? true : false}>
      <input
        className={className}
        type={type}
        id={name}
        {...field}
        {...props}
        autoComplete="off"
      />
      {children ? <div className="input-icon">{children}</div> : null}
    </InputStyles>
  );
};

export default Input;
