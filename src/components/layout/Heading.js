import React from "react";
import styled from "styled-components";
const HeadingStyles = styled.h2`
  color: ${(props) => props.theme.secondary};
  font-size: 28px;
  font-weight: 500;
  position: relative;
  margin-bottom: 30px;
  &:before {
    content: "";
    width: 60px;
    height: 5px;
    background-image: linear-gradient(
      to right bottom,
      ${(props) => props.theme.primary},
      ${(props) => props.theme.secondary}
    );
    position: absolute;
    top: 0;
    left: 0;
    transform: translate(0, -150%);
  }
`;
const Heading = ({ className = "", children }) => {
  return <HeadingStyles className={className}>{children}</HeadingStyles>;
};

export default Heading;
