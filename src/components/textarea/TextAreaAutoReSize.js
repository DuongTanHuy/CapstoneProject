// import React, { useState } from "react";
// import { useEffect } from "react";
// import { useRef } from "react";

// const TextAreaAutoReSize = () => {
//   const [text, setText] = useState("");
//   const textAreaRef = useRef(null);
//   const [textAreaHeight, setTextHeight] = useState("auto");

//   const handleChange = (event) => {
//     setTextHeight("auto");
//     setText(event.target.value);
//     // setTextHeight(`${textAreaRef?.current?.scrollHeight}px`);
//   };

//   useEffect(() => {
//     setTextHeight(`${textAreaRef?.current?.scrollHeight}px`);
//   }, [text]);

//   return (
//     <div className="w-full">
//       <textarea
//         className="overflow-hidden bg-[#E7ECF3] p-5 !w-full rounded border-2 border-transparent resize-none outline-none focus:border-primary"
//         placeholder="Please enter your content here..."
//         value={text}
//         ref={textAreaRef}
//         style={{
//           height: textAreaHeight,
//         }}
//         onChange={handleChange}
//       ></textarea>
//     </div>
//   );
// };

// export default TextAreaAutoReSize;

import React from "react";
import { useController } from "react-hook-form";
import styled from "styled-components";

const InputStyles = styled.div`
  position: relative;
  width: 100%;
  textarea {
    width: 100%;
    padding: ${(props) => (props.hasIcon ? "16px 60px 16px 16px" : "16px")};
    background-color: ${(props) => props.theme.grayLight};
    border-radius: 8px;
    font-weight: 500;
    transition: all 0.2s linear;
    border: 2px solid transparent;
    outline: none;
  }
  textarea:focus {
    background-color: white;
    border-color: ${(props) => props.theme.primary};
  }
  textarea ::-webkit-input-placeholder {
    color: #84878b;
  }
  textarea::-moz-input-placeholder {
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

const Textarea = ({
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
      <textarea
        className={`${className} overflow-hidden bg-[#E7ECF3] p-5 !w-full rounded border-2 border-transparent resize-none outline-none focus:border-primary`}
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

export default Textarea;
